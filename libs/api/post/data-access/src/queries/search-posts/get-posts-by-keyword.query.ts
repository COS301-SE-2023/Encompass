export class GetPostsByKeywordQuery{
  constructor(public readonly keyword: string, public readonly userId: string){}
}