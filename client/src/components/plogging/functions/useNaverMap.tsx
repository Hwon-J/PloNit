import { naver } from "components/common/useNaver";
import { Coordinate } from "interface/ploggingInterface";
import Swal from "sweetalert2";

interface IcreateMarker {
  latitude: number;
  longitude: number;
  map: naver.maps.Map | undefined;
  url: string;
  cursor?: string;
}

interface IcreateCustomControl {
  html: string;
  pos: naver.maps.Position;
}

interface IcreateMarkers {
  items: Coordinate[];
  map: naver.maps.Map | undefined;
  url: string;
  cursor?: string;
}

interface IcontrolMarkers {
  markers: naver.maps.Marker[];
  map: naver.maps.Map | null;
}

function createMarker({
  latitude,
  longitude,
  map,
  url,
  cursor = "pointer",
}: IcreateMarker): naver.maps.Marker {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(latitude, longitude),
    map: map,
    icon: {
      url: url,
      size: new naver.maps.Size(35, 35),
      scaledSize: new naver.maps.Size(35, 35),
      origin: new naver.maps.Point(0, 0),
      anchor: new naver.maps.Point(17.5, 17.5),
    },
    cursor: cursor,
  });

  return marker;
}

function createCustomControl({
  html,
  pos,
}: IcreateCustomControl): naver.maps.CustomControl {
  const CustomControl = new naver.maps.CustomControl(html, {
    position: pos,
  });

  return CustomControl;
}

function createMarkers({
  items,
  map,
  url,
  cursor = "pointer",
}: IcreateMarkers): naver.maps.Marker[] {
  const markers: naver.maps.Marker[] = [];
  items.forEach((item) => {
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(item.latitude, item.longitude),
      map: map,
      icon: {
        url: url,
        size: new naver.maps.Size(35, 35),
        scaledSize: new naver.maps.Size(35, 35),
        origin: new naver.maps.Point(0, 0),
        anchor: new naver.maps.Point(17.5, 17.5),
      },
      cursor: cursor,
    });
    markers.push(marker);
  });

  // Help의 경우
  if (items[0]?.image) {
    markers.forEach((marker, index) => {
      naver.maps.Event.addListener(marker, "click", () => {
        Swal.fire({
          imageUrl: items[index].image,
          imageWidth: `70vw`,
          imageHeight: `auto`,
          imageAlt: `helpImage`,
          text: items[index].context,
          showConfirmButton: false,
          showCloseButton: true,
        });
      });
    });
  }

  return markers;
}

function controlMarkers({ markers, map }: IcontrolMarkers): void {
  markers.forEach((marker) => {
    marker.setMap(map);
  });
}

export { createMarker, createCustomControl, createMarkers, controlMarkers };
