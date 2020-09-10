import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService, SearchOptions } from 'src/core/shared';
import { checkFilterForObjectId } from 'src/core/utils';
import { User } from './models';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel(User.name) readonly Model: Model<User>) {
    super(Model);
  }

  async search(dto: SearchOptions) {
    let query = [];

    const { sort, dir, searchTerm, filterBy, offset, size } = dto;

    if (sort && dir) {
      this.sort(query, sort, dir);
    }
    if (searchTerm || filterBy?.length) {
      this.filter(query, searchTerm, filterBy);
    }

    query.push({ $project: { password: 0, __v: 0 } });

    return await this.aggregate(query, offset, size);
  }

  private sort(query: any, sort: string, dir: string) {
    switch (sort) {
      case 'email':
        if (dir === 'asc') {
          query.push({ $sort: { [sort]: 1 } });
        } else if (dir === 'desc') {
          query.push({ $sort: { [sort]: -1 } });
        }
    }
  }

  private filter(query: any, searchTerm: string, filterBy: any[]) {
    if (searchTerm) {
      query.push({
        $match: {
          $or: [
            { name: new RegExp(searchTerm, 'i') },
            { email: new RegExp(searchTerm, 'i') },
          ],
        },
      });
    }

    if (filterBy?.length) {
      let matchQry = [];
      for (const filter of filterBy) {
        matchQry.push(checkFilterForObjectId(filter));
      }
      query.push({ $match: { $and: matchQry } });
    }
  }
}
