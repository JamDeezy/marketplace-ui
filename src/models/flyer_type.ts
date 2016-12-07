class FlyerType {
  id: number;
  name: string;
  deleted: boolean;

  static fromJson(json: any): FlyerType {
    var ft = new FlyerType();
    ft.id = json['id'];
    ft.name = json['name'];
    ft.deleted = json['deleted'];
    return ft;
  }

  toJson(): any {
    return {};
  }
}

export default FlyerType