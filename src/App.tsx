import React, {useRef, useEffect, useState, useContext} from 'react';
import {View, Text} from 'react-native';
import {Icon, ThemeContext, ListItem} from 'react-native-elements';
import MapboxGL, {
  MapViewProps,
  ShapeSourceProps,
} from '@react-native-mapbox-gl/maps';
import {Position, Feature} from 'geojson';
import {secrets} from './secrets';

MapboxGL.setAccessToken(secrets.mapboxAccessToken);

type AppProps = Pick<
  MapViewProps,
  'onRegionDidChange' | 'onRegionIsChanging' | 'onRegionWillChange'
> &
  Pick<ShapeSourceProps, 'shape'> & {
    coordinates?: Position;
    zoom?: number;
    showMarker?: boolean;
    onPressFeature?: ShapeSourceProps['onPress'];
    onPressMap?: MapViewProps['onPress'];
  };

type AppState = {
  coordinates?: Position;
  zoom?: number;
  height?: number;
};

export const App: React.FC<AppProps> = (props) => {
  const {theme} = useContext(ThemeContext);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [state, setState] = useState<AppState>(props);

  return (
    <>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
        }}>
        <MapboxGL.MapView
          onLayout={(event) =>
            setState({...state, height: event.nativeEvent.layout.height})
          }
          onRegionDidChange={props.onRegionDidChange}
          onRegionIsChanging={props.onRegionIsChanging}
          onRegionWillChange={props.onRegionWillChange}
          rotateEnabled={false}
          pitchEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          style={{flex: 1}}
          styleURL={secrets.mapboxStyleURL}
          onPress={props.onPressMap}>
          <MapboxGL.Camera
            zoomLevel={state.zoom}
            ref={cameraRef}
            maxZoomLevel={16}
            centerCoordinate={state.coordinates}
            animationDuration={0}
          />
          {props.shape && (
            <MapboxGL.ShapeSource
              id="exampleShapeSource"
              shape={props.shape}
              onPress={props.onPressFeature}>
              <MapboxGL.CircleLayer
                id="notificationCircle"
                style={{
                  circleColor: theme.colors?.error,
                  circleOpacity: ['get', 'opacity'],
                  circleRadius: 20,
                  circleTranslate: [0, 0],
                }}
              />
            </MapboxGL.ShapeSource>
          )}
        </MapboxGL.MapView>
        {props.showMarker && state.height && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: state.height / 2 - 22,
              left: 0,
              right: 0,
            }}>
            <Icon name={'map-marker'} type="material-community" />
          </View>
        )}
      </View>
    </>
  );
};
