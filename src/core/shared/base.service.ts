import { Model, Document, Types } from 'mongoose';
import { InvalidIdException, RecordNotFoundException } from '../exceptions';
import { ObjectId } from '../utils';
import { Pagination } from './pagination.interface';

/**
 * Base class for all services based on crud
 */
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
    if (!doc) throw new RecordNotFoundException(this.model.modelName);

    return (doc as unknown) as T;
  }

  /**
   * Updates one document by condition.
   */
  async updateOne(filter: any, updates: any, projection = {}) {
    const options = { new: true, projection };
    const doc = await this.model.findOneAndUpdate(filter, updates, options);
    if (!doc) throw new RecordNotFoundException(this.model.modelName);

    return (doc as unknown) as T;
  }

  /**
   * Updates a single document by its _id field
   */
  async update(id: string | ObjectId, updates: any, projection = {}) {
    const options = { new: true, projection };
    const doc = await this.model.findByIdAndUpdate(
      this.toObjectId(id),
      updates,
      options,
    );
    if (!doc) throw new RecordNotFoundException(this.model.modelName);

    return (doc as unknown) as T;
  }

  /**
   * Removes a single document by its _id field
   */
  async remove(id: string | ObjectId) {
    const doc = await this.model.findByIdAndDelete(this.toObjectId(id));
    if (!doc) throw new RecordNotFoundException(this.model.modelName);

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

    const content = data[0]?.content || [];
    const count = data[0]?.count || 0;

    return { count, content } as Pagination<T>;
  }
}
