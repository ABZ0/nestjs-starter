import { Model, Document, Types } from 'mongoose';
import { asap } from 'rxjs';
import { InvalidIdException } from '../exceptions';
import { ObjectId } from '../utils';
import { Pagination } from './pagination.interface';

export class BaseService<T> {
  constructor(protected model: Model<Document>) {}

  /**
   * Validate id and return a valid bson ObjectId
   */
  public toObjectId(id: string | ObjectId) {
    if (!Types.ObjectId.isValid(id)) {
      throw new InvalidIdException();
    }

    return typeof id === 'string' ? Types.ObjectId(id) : id;
  }

  /**
   * Returns true if at least one document exists in the database
   */
  public async exists(filter: any) {
    return await this.model.exists(filter);
  }

  /**
   * Shortcut for saving one or more documents to the database.
   */
  async create(model: any): Promise<T> {
    const doc = await this.model.create(model);
    return (doc as unknown) as T;
  }

  /**
   * Finds one document by condition.
   */
  async findOne(filter: any, projection = {}) {
    const doc = await this.model.findOne(filter, projection);
    return (doc as unknown) as T;
  }

  /**
   * Finds a single document by its _id field
   */
  async findById(id: string | ObjectId, projection = {}) {
    const doc = await this.model.findById(this.toObjectId(id), projection);
    return (doc as unknown) as T;
  }

  /**
   * Updates one document by condition.
   */
  async updateOne(filter: any, updates: any, projection = {}) {
    const doc = await this.model.findOneAndUpdate(filter, updates, {
      new: true,
      projection,
    });
    return (doc as unknown) as T;
  }

  /**
   * Updates a single document by its _id field
   */
  async updateById(id: string | ObjectId, updates: any, projection = {}) {
    const doc = await this.model.findByIdAndUpdate(
      this.toObjectId(id),
      updates,
      {
        new: true,
        projection,
      },
    );
    return (doc as unknown) as T;
  }

  /**
   * Removes one document by condition.
   */
  async deleteOne(filter: any) {
    const doc = await this.model.findOneAndRemove(filter);
    return (doc as unknown) as T;
  }

  /**
   * Removes a single document by its _id field
   */
  async deleteById(id: string | ObjectId) {
    const doc = await this.model.findByIdAndDelete(this.toObjectId(id));
    return (doc as unknown) as T;
  }

  /**
   * Performs aggregations on the models collection to obtain {size} documents.
   */
  async aggregate(query: any[], offset: number, size: number) {
    const data = await this.model.aggregate([
      ...query,
      {
        $group: { _id: null, content: { $push: '$$ROOT' }, count: { $sum: 1 } },
      },
      {
        $project: {
          content: { $slice: ['$content', offset, size] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    return {
      content: data[0]?.content || [],
      count: data[0]?.count || 0,
    } as Pagination<T>;
  }

  /**
   * Performs aggregations on the models collection to obtain one document.
   */
  async aggregateOne(query: any[]) {
    const data = await this.model.aggregate([{ $limit: 1 }, ...query]);
    return (data[0] as unknown) as T;
  }
}
