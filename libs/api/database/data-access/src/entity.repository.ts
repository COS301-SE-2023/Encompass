import { NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  FilterQuery,
  FlattenMaps,
  // LeanDocument,
  Model,
  Require_id,
  // _AllowStringsForIds,
} from 'mongoose';

import { EntitySchemaFactory } from './entity-schema.factory';
import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export abstract class EntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot
> {
  constructor(
    protected readonly entityModel: Model<TSchema>,
    protected readonly entitySchemaFactory: EntitySchemaFactory<
      TSchema,
      TEntity
    >
  ) {}

  protected async findOne(
    entityFilterQuery?: FilterQuery<TSchema>
  ): Promise<TEntity> {
    const entityDocument = await this.entityModel.findOne(
      entityFilterQuery,
      {},
      { lean: true }
    );

    if (!entityDocument) {
      throw new NotFoundException('Unable to find the entity.');
    }

    return this.entitySchemaFactory.createFromSchema(entityDocument as TSchema) as TEntity;
  }

  protected async find(
    entityFilterQuery: FilterQuery<TSchema>
  ): Promise<TEntity[]> {
    const entityDocuments = await this.entityModel.find(
      entityFilterQuery,
      {},
      { lean: true }
    );

    // Assuming that entitySchemaFactory.createFromSchema returns TEntity
    return entityDocuments.map(
      (entityDocument: Require_id<FlattenMaps<TSchema>>): TEntity =>
        this.entitySchemaFactory.createFromSchema(entityDocument as TSchema) as TEntity
    );
  }

  async create(entity: TEntity): Promise<void> {
    await new this.entityModel(this.entitySchemaFactory.create(entity)).save();
  }

  protected async findOneAndReplace(
    entityFilterQuery: FilterQuery<TSchema>,
    entity: TEntity
  ): Promise<void> {
    // console.log("findoneandreplace");
    const updatedEntityDocument = await this.entityModel.findOneAndReplace(
      entityFilterQuery,
      this.entitySchemaFactory.create(entity),
      {
        new: true,
        useFindAndModify: false,
        lean: true,
      }
    );
      // console.log("updatedEntityDocument", updatedEntityDocument);
    if (!updatedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to replace.');
    }
  }

  protected async findOneAndDelete(
    entityFilterQuery: FilterQuery<TSchema>
  ): Promise<void> {
    const deletedEntityDocument = await this.entityModel.findOneAndDelete(
      entityFilterQuery,
      {
        lean: true,
      }
    );

    if (!deletedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to delete.');
    }
  }

  protected async findAndDeleteByPost(
    entityFilterQuery: FilterQuery<TSchema>
  ): Promise<void> {
    const deletedEntityDocument = await this.entityModel.deleteMany(
      entityFilterQuery,
      {
        lean: true,
      }
    );

    if (!deletedEntityDocument) {
      throw new NotFoundException('Unable to find the entity to delete.');
    }
  }
}
