import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForgotPasswordDto, ResetPasswordDto, SignUpDto } from 'src/auth/dto';
import { VerifyEmailDto } from 'src/auth/dto/verify-email.dto';
import { RecordExistsException } from 'src/core/exceptions';
import { BaseService, SearchOptions } from 'src/core/shared';
import { EmailToken } from './entities/email-token.entity';
import { User } from './entities/user.entity';
import { MailService } from './mail.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.name) readonly uModel: Model<User>,
    @InjectModel(EmailToken.name) readonly emailTokenModel: Model<EmailToken>,
    private readonly mailService: MailService,
  ) {
    super(uModel);
  }

  async createWithPassword(signUpDto: SignUpDto): Promise<User> {
    try {
      const user = await this.create(signUpDto);
      const token = await new this.emailTokenModel({ userId: user._id }).save();
      await this.mailService.sendEmailVerification(user.email, token.code);

      return user;
    } catch (error) {
      if (error.code === 11000) throw new RecordExistsException('Email');
      throw error;
    }
  }

  async verifyEmail(code: string): Promise<boolean> {
    const user = await this.verifyEmailToken(code);
    await user.save();

    return true;
  }

  async sendResetPasswordEmail(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.findOne({ email: dto.email });
    if (!user) return;

    const token = await new this.emailTokenModel({ userId: user._id }).save();
    await this.mailService.sendResetPasswordMail(user.email, token.code);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<boolean> {
    const user = await this.verifyEmailToken(dto.code);
    user.password = dto.newPassword;
    await user.save();

    return true;
  }

  async verifyEmailToken(code: string): Promise<User> {
    const token = await this.emailTokenModel.findOne({ code });

    if (!token) {
      throw new BadRequestException('Invalid Token');
    }

    const user = await this.findById(token.userId);

    if (token.expired) {
      await token.remove();
      throw new GoneException();
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
    }

    await token.remove();

    return user;
  }

  async findAll(options: SearchOptions) {
    let query = [];

    const { sort, dir, searchTerm, offset, size } = options;

    /* --------------------------------- FILTERS -------------------------------- */

    /* --------------------------------- SEARCH --------------------------------- */
    if (searchTerm) {
      this.search(query, searchTerm);
    }

    /* ---------------------------------- SORT ---------------------------------- */
    if (sort && dir) {
      this.sort(query, sort, dir);
    }

    return await this.aggregate(query, offset, size);
  }

  private sort(query: any, sort: string, dir: string) {
    switch (sort) {
      case 'createdAt':
      case 'updatedAt':
        if (dir === 'asc') {
          query.push({ $sort: { [sort]: 1 } });
        } else if (dir === 'desc') {
          query.push({ $sort: { [sort]: -1 } });
        }
    }
  }

  private search(query: any, searchTerm: string) {
    if (searchTerm) {
      query.push({
        $match: {
          $or: [{ email: new RegExp(searchTerm, 'i') }],
        },
      });
    }
  }
}
