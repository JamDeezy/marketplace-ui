import FlyerRun from './flyer_run'
import FlyerType from './flyer_type'

class Merchant {

  id: number;
  name: string;
  mp_ported: boolean;

  static fromJson(json: any): Merchant {
    var m = new Merchant();
    m.id = json['id'];
    m.name = json['name'];
    m.mp_ported = json['mp_ported'];

    return m;
  }

  static fetchFlyerRuns(merchantId: number): Promise<Array<FlyerRun>> {
    return new Promise<Array<FlyerRun>>((resolve, reject) => {
      $.ajax({
        url: '/api/merchants/' + merchantId + '/flyer_runs',
        method: 'GET',
        complete: function(response) {
          var json = response.responseJSON;
          resolve(json.flyer_runs.map(function(data: any) {
            return FlyerRun.fromJson(data);
          }));
        },
        error: function(error) {
          reject(error);
        }
      })
    });
  }

  static fetchFlyerTypes(merchantId: number): Promise<Array<FlyerType>> {
    return new Promise<Array<FlyerType>>((resolve, reject) => {
      $.ajax({
        url: '/api/merchants/' + merchantId + '/flyer_types',
        method: 'GET',
        complete: function(response) {
          var json = response.responseJSON;
          resolve(json.flyer_types.map(function(data: any) {
            return FlyerType.fromJson(data);
          }));
        },
        error: function(error) {
          reject(error);
        }
      })
    });
  }

}

export default Merchant;