import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(fillterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(fillterQuery, {}, { lean: true });
    if (!document) {
      this.logger.warn('Document not found with filtterQuery', fillterQuery);
      throw new NotFoundException('Document not found');
    }
    return document as unknown as TDocument;
  }

  async findOneAndUpdate(
    fillterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(fillterQuery, update, {
      lean: true,
      new: true,
    });
    if (!document) {
      this.logger.warn('Document not found with filtterQuery', fillterQuery);
      throw new NotFoundException('Document not found');
    }
    return document as unknown as TDocument;
  }

  async find(fillterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(fillterQuery, {}, { lean: true });
  }

  async findOneAndDelete(fillterQuery: FilterQuery<TDocument>) {
    return await this.model.findOneAndDelete(fillterQuery, { lean: true });
  }
}
