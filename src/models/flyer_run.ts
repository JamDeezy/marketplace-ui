class FlyerRun {
  id: number;
  name: string;
  flyerTypeId: number;
  availableFrom: string;
  availableTo: string;
  hideInDistribution: number = 0;
  hideInFlipp: number = 0;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean = false;

  static fromJson(json: any): FlyerRun {
    var fr = new FlyerRun();
    fr.id = json['id'];
    fr.availableFrom = json['available_from'];
    fr.availableTo = json['available_to'];
    fr.createdAt = json['created_at'];
    fr.deleted = json['deleted'];
    fr.flyerTypeId = json['flyer_type_id'];
    fr.hideInDistribution = json['hide_in_distribution'];
    fr.hideInFlipp = json['hide_in_flipp'];
    fr.name = json['name'];
    fr.updatedAt = json['updated_at'];

    return fr;
  }

  toJson(): any {
    return {
      'available_from': this.availableFrom,
      'available_to': this.availableTo,
      'created_at': this.createdAt,
      'deleted': this.deleted,
      'flyer_type_id': this.flyerTypeId,
      'hide_in_distribution': this.hideInDistribution,
      'hide_in_flipp': this.hideInFlipp,
      'id': this.id,
      'name': this.name,
      'updated_at': this.updatedAt
    }
  }
}

export default FlyerRun