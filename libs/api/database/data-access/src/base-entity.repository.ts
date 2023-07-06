import { AggregateRoot } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { EntityRepository } from './entity.repository';

import { IdentifiableEntitySchema } from './identifiable-entity.schema';

export abstract class BaseEntityRepository<
  TSchema extends IdentifiableEntitySchema,
  TEntity extends AggregateRoot
> extends EntityRepository<TSchema, TEntity> {
  async findOneById(id: string): Promise<TEntity> {
    return this.findOne({ _id: new ObjectId(id) } as FilterQuery<TSchema>);
  }

  async findOneByEmail(item: string): Promise<TEntity> {
    return this.findOne({ email: item } as FilterQuery<TSchema>);
  }

  async findOneByName(item: string):Promise<TEntity>{
    return this.findOne({ name: item } as FilterQuery<TSchema>);
  }

  async findOneAndReplaceById(id: string, entity: TEntity): Promise<void> {
    await this.findOneAndReplace(
      { _id: new ObjectId(id) } as FilterQuery<TSchema>,
      entity,
    );
  }

  async findOneByUsername(item: string): Promise<TEntity> {
    return this.findOne({ username: item } as FilterQuery<TSchema>);
  }

  async findAll(): Promise<TEntity[]> {
    return this.find({});
  }

  async findAndDelete(id: string): Promise<void> {
    await this.findOneAndDelete({ _id: new ObjectId(id) });
  }

  async findCommentsByUsername(item: string): Promise<TEntity[]> {
   return await this.find({ username: item } as FilterQuery<TSchema>);
  }

  async findSubCommentsByUsername(item: string): Promise<TEntity[]> {
    return await this.find({ replies: {username: item} } as FilterQuery<TSchema>);
  }

  //review this later
  /*async findCommunitiesByUserId(id: string): Promise<TEntity[]> {
    const allCommunities = await this.findAll();
    const communitiesToRemove = await this.find({ members: [id] });

    const filteredCommunities = allCommunities.filter(community => !communitiesToRemove.includes(community));

    return filteredCommunities;
    //return allCommunities;
  }*/
}