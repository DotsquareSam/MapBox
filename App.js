// url="https://api.mapbox.com/directions/v5/mapbox/driving/75.8326415,26.8903947;75.77776848605518,26.839603232353127;75.7741043947538,%2026.858269162096775?geometries=geojson&access_token=sk.eyJ1Ijoic2FjaGluZG90IiwiYSI6ImNrdG1sZXlvbzBpaTUyd281cDJ6YmV3Z3AifQ.5ri5ibFolY3dXLCLNuZTbA"

import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import ToggleSwitch from 'toggle-switch-react-native'

MapboxGL.setAccessToken('sk.eyJ1Ijoic2FjaGluZG90IiwiYSI6ImNrdG1sZXlvbzBpaTUyd281cDJ6YmV3Z3AifQ.5ri5ibFolY3dXLCLNuZTbA');

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: 'tomato'
  },
  map: {
    flex: 1
  }
});

export default class App extends Component {

  constructor(props) {
    super()
    this.state = {
      isOn:true,
      coordinate: [[75.8326415, 26.8903947], [75.77776848605518, 26.839603232353127], [75.7741043947538, 26.858269162096775]],
      route: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [75.832563,26.89046],[75.83177,26.890673],[75.830849,26.88978],[75.830439,26.890126],[75.827305,26.887003],[75.819998,26.889939],[75.819378,26.889942],[75.814966,26.891741],[75.814264,26.891378],[75.812659,26.884941],[75.806535,26.861296],[75.801731,26.842786],[75.802018,26.841811],[75.803386,26.839959],[75.802429,26.83804],[75.800129,26.837708],[75.798672,26.838881],[75.786712,26.838458],[75.777773,26.839713],[75.776988,26.839735],[75.777636,26.84367],[75.775817,26.847614],[75.773756,26.849587],[75.772953,26.856207],[75.774234,26.856401],[75.774113,26.858239]//Point B ~ to
              ],
            },
            style: {
              fill: 'red',
              strokeWidth: '10',
              fillOpacity: 0.6,
            },
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.8,
            },
          },
        ],
      },
    }
  }

  componentDidMount() {
    Logger.setLogCallback(log => {
      const { message } = log;

      // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
      if (
        message.match('Request failed due to a permanent error: Canceled') ||
        message.match('Request failed due to a permanent error: Socket Closed')
      ) {
        return true;
      }
      return false;
    });
  }
  async cord() {
    const coordinate = await this._map.getPointInView([-37.817070, 144.949901]);
    console.log(coordinate)
  }

  renderAnnotation(counter) {
    const id = `pointAnnotation${counter}`;
    const coordinate = this.state.coordinate[counter];
    const title = `Longitude: ${this.state.coordinate[counter][0]} Latitude: ${this.state.coordinate[counter][1]}`;

    return (
      <MapboxGL.PointAnnotation
        key={id}
        id={id}
        title='Test'
        coordinate={coordinate} draggable>

        {/* <Image
        source={require('./asset/download.png')}
        style={{
          flex: 1,
          resizeMode: 'contain',
          width: 25,
          height: 25
          }}/> */}

      </MapboxGL.PointAnnotation>
    );
  }

  renderAnnotations() {
    console.log(this.state.coordinate.length)
    const items = [];

    for (let i = 0; i < this.state.coordinate.length; i++) {
      items.push(this.renderAnnotation(i));
    }
    return items;

  }
  async fetchDirections(origin, destination) {
    const mapboxClient = new MapboxClient("sk.eyJ1Ijoic2FjaGluZG90IiwiYSI6ImNrdG1sZXlvbzBpaTUyd281cDJ6YmV3Z3AifQ.5ri5ibFolY3dXLCLNuZTbA");

    const originLatLng = {
      latitude: origin[1],
      longitude: origin[0],
    };

    const destLatLng = {
      latitude: dest[1],
      longitude: dest[0],
    };

    const requestOptions = {
      profile: this.props.type,
      geometry: 'polyline',
    };

    let res = null;
    try {
      res = await mapboxClient.getDirections([
        originLatLng,
        destLatLng,
      ], requestOptions);
    } catch (e) {
      console.log(e);
    }

    if (res !== null) {
      const directions = res.entity.routes[0];
      this.setState({ directions: directions });
    }
  }

  render() {
    return (
      // onPress={(feautre) => {console.log('Coords:', feautre.geometry.coordinates);this.state.coordinate.push(feautre.geometry.coordinates);this.forceUpdate()}}
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView
            styleURL="mapbox://styles/sachindot/cktmybjeiail618qr31or1sd1"

            style={styles.map}
            zoomEnabled
          >
            {this.renderAnnotations()}
            <MapboxGL.ShapeSource id="line1" shape={this.state.route}>
              <MapboxGL.LineLayer
                id="linelayer1"
                style={{
                  lineColor: 'red',
                  lineWidth: 5,
                  lineCap: 'round',
                  lineRoundLimit: 500
                }}
              />
            </MapboxGL.ShapeSource>
            <MapboxGL.Camera zoomLevel={11} centerCoordinate={this.state.coordinate[this.state.coordinate.length - 3]} />
          </MapboxGL.MapView>
          <ToggleSwitch
  isOn={this.state.isOn}
  onColor="green"
  offColor="red"
  label="Example label"
  labelStyle={{ color: "black", fontWeight: "900" }}
  size="large"
  onToggle={isOn => this.setState({isOn:!this.state.isOn})}
/>
        </View>
      </View>
    );
  }
}