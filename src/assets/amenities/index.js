import carParking from './car-parking.webp';
import security from './security.webp';
import jacuzzi from './jacuzzi.webp';
import tableTennis from './table-tennis.webp';
import swimmingPool from './swimming-pool.webp';
import childrenPlay from './children-play.webp';
import bonfire from './bonfire.webp';
import trampoline from './trampoline.webp';
import soundSystem from './dj-sound.webp';
import driverRooms from './private-rooms.webp';
import petFriendly from './pet-friendly.webp';
import eventSpaces from './event-lawns.webp';

export const amenityIcons = {
  parking: carParking,
  car: carParking,
  'car-parking': carParking,
  'sufficient-car-parking': carParking,

  security: security,
  '24-hour-security': security,
  '24-hr-security': security,

  jacuzzi: jacuzzi,
  '6-seater-jacuzzi': jacuzzi,

  'table-tennis': tableTennis,
  games: tableTennis,

  pool: swimmingPool,
  'swimming-pool': swimmingPool,

  'children-play': childrenPlay,
  'childrens-play-area': childrenPlay,
  'kids-play': childrenPlay,

  bonfire: bonfire,
  'bonfire-bbq': bonfire,
  bbq: bonfire,

  trampoline: trampoline,

  music: soundSystem,
  dj: soundSystem,
  speaker: soundSystem,
  'jbl-party-box': soundSystem,
  'inhouse-outside-dj': soundSystem,

  rooms: driverRooms,
  'private-rooms': driverRooms,
  'driver-lodging': driverRooms,
  '2-private-rooms': driverRooms,
  '2-private-guest-rooms': driverRooms,

  pet: petFriendly,
  'pet-friendly': petFriendly,
  'pet-friendly-estate': petFriendly,

  events: eventSpaces,
  'event-spaces': eventSpaces,
  'spacious-outdoor-lawn': eventSpaces,
  'expansive-lawn': eventSpaces,
  lawns: eventSpaces,
};

export default amenityIcons;
