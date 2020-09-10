export class CombinedVm {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
