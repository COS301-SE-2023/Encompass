export class GetComments{
  static readonly type = '[Comments] Get Comments';
  constructor(public readonly postId: string){}
}