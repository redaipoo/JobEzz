import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { palette } from './design';

/* Data-driven SVG icon set (brand-consistent line icons).
   Mirrors the web prototype's icons.js so both apps share one visual language. */

type El = [string, any];
const P = (d: string, extra: any = {}) => (['path', { d, ...extra }] as El);
const C = (cx: number, cy: number, r: number, extra: any = {}) => (['circle', { cx, cy, r, ...extra }] as El);
const R = (x: number, y: number, w: number, h: number, extra: any = {}) => (['rect', { x, y, width: w, height: h, ...extra }] as El);

const ICONS: any = {
  home: [P('M3 10.5 12 3l9 7.5'), P('M5 9.5V20h14V9.5'), P('M9.5 20v-6h5v6')],
  jobs: [R(3, 7, 18, 13, { rx: 2 }), P('M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'), P('M3 12h18')],
  services: [R(3, 8, 18, 12, { rx: 2 }), P('M9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3'), P('M12 12v3')],
  courses: [P('M4 5h9a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z'), P('M15 8h4a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2'), P('M8 4v3M11 4v3')],
  profile: [C(12, 8, 4), P('M4 21c0-4 4-6 8-6s8 2 8 6')],
  back: [P('M14 6l-6 6 6 6')],
  bell: [P('M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9'), P('M13.7 21a2 2 0 0 1-3.4 0')],
  chat: [P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')],
  pin: [P('M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z'), C(12, 10, 2.5)],
  check: [P('M20 6 9 17l-5-5')],
  shield: [P('M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'), P('M9 12l2 2 4-4')],
  send: [P('M22 2 11 13M22 2l-7 20-4-9-9-4z')],
  play: [P('M8 5v14l11-7z', { fill: palette.accent, stroke: 'none' })],
  doc: [P('M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'), P('M14 3v6h6M9 13h6M9 17h6')],
  gift: [R(3, 8, 18, 4), P('M2 7h20v5H2z'), P('M12 22V7'), P('M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z'), P('M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z')],
  flag: [P('M4 21V4h13l-2 4 2 4H4')],
  plus: [P('M12 5v14M5 12h14')],
  wallet: [R(3, 6, 18, 13, { rx: 2 }), P('M16 12h.01M21 10V8a2 2 0 0 0-2-2H5')],
  settings: [C(12, 12, 3), P('M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.3-1.3L14 3h-4l-.3 2.4a7 7 0 0 0-2.3 1.3l-2.3-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.4 2.3-1c.7.6 1.5 1 2.3 1.3L10 21h4l.3-2.4c.8-.3 1.6-.7 2.3-1.3l2.3 1 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z')],
  search: [C(11, 11, 7), P('M21 21l-4.3-4.3')],
  star: [P('M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z', { fill: palette.warning, stroke: 'none' })],
  starEmpty: [P('M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z')],
  building: [R(4, 2, 16, 20, { rx: 2 }), P('M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M11 18h2v4')],
  user: [C(12, 7, 4), P('M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2')],
  clock: [C(12, 12, 9), P('M12 6v6l4 2')],
  money: [R(2, 6, 20, 12, { rx: 2 }), C(12, 12, 3), P('M6 12h.01M18 12h.01')],
  logout: [P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'), P('M16 17l5-5-5-5'), P('M21 12H9')],
  filter: [P('M22 3H2l8 9.46V19l4 2v-8.54L22 3z')],
  sun: [C(12, 12, 5), P('M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4')],
  all: [C(12, 12, 9), P('M12 3v18M3 12h18'), P('M3 3l4 4M17 3l-4 4M3 21l4-4M17 21l-4-4')],
  starFill: [P('M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9z', { fill: palette.warning, stroke: 'none' })],
  grid: [R(3, 3, 7, 7, { rx: 1.5 }), R(14, 3, 7, 7, { rx: 1.5 }), R(3, 14, 7, 7, { rx: 1.5 }), R(14, 14, 7, 7, { rx: 1.5 })],
  chart: [P('M3 20h18'), P('M5 17V10M9 17V6M13 17V9M17 17V4')],
  crown: [P('M2 20h20M4 20l1-12 7 5 7-5 1 12z')],
  verified: [P('M12 2l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'), P('M9 12l2 2 4-4')],
  heart: [P('M12 21C12 21 3 13 3 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-9 13-9 13z')],
  heartFill: [P('M12 21C12 21 3 13 3 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 5-9 13-9 13z', { fill: palette.danger, stroke: 'none' })],
  trending: [P('M23 6l-9.5 9.5-5-5L1 18'), P('M17 6h6v6')],
  close: [P('M18 6 6 18M6 6l12 12')],
  bolt: [P('M13 2 3 14h9l-1 8 10-12h-9l1-8z')],
  phone: [P('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z')],
  share: [P('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8'), P('M16 6l-4-4-4 4'), P('M12 2v13')],
  fire: [P('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z')],
  calendar: [R(3, 5, 18, 16, { rx: 2 }), P('M8 3v4M16 3v4M3 10h18')],
  alert: [P('M12 3 2 21h20z'), P('M12 10v4'), P('M12 17.5h.01')],
  checkCircle: [C(12, 12, 9), P('M8.5 12.5l2.5 2.5 5-5')],
  info: [C(12, 12, 9), P('M12 11v5'), P('M12 8h.01')],
  eye: [P('M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z'), C(12, 12, 3)],
  target: [C(12, 12, 9), C(12, 12, 4), C(12, 12, 1)],
  trophy: [P('M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0z'), P('M7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5')],
  pause: [R(6, 5, 4, 14, { rx: 1 }), R(14, 5, 4, 14, { rx: 1 })],
  bank: [P('M3 9l9-6 9 6M4 9v9M9 9v9M15 9v9M20 9v9M3 21h18')],
  card: [R(2, 5, 20, 14, { rx: 2 }), P('M2 10h20M6 15h4')],
  receipt: [P('M6 3h12v18l-3-2-3 2-3-2-3 2z'), P('M9 8h6M9 12h6')],
  globe: [C(12, 12, 9), P('M3 12h18'), P('M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z')],
  moon: [P('M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z')],
  video: [P('M3 6h12v12H3z'), P('M15 10l6-3v10l-6-3')],
  mic: [R(9, 3, 6, 11, { rx: 2 }), P('M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8')],
  image: [R(3, 5, 18, 14, { rx: 2 }), C(9, 10, 2), P('M3 17l5-4 4 3 3-2 6 5')],
  award: [C(12, 9, 6), P('M8.5 14.5 7 21l5-2.5L17 21l-1.5-6.5')],
  sparkle: [P('M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'), P('M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z')],
  scissors: [C(6, 6, 3), C(6, 18, 3), P('M8.5 8.5 20 20M8.5 15.5 20 4')],
  refresh: [P('M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6')],
  download: [P('M12 3v12M6 11l6 6 6-6'), P('M5 21h14')],
  trash: [P('M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14'), P('M10 11v6M14 11v6')],
  lock: [R(3, 11, 18, 8, 2), P('M7 11V7a5 5 0 0 1 10 0v4')],
  mail: [R(3, 5, 18, 14, { rx: 2 }), P('M3 7l9 6 9-6')],
  users: [C(9, 8, 4), P('M3 20c0-3.5 3-5 6-5s6 1.5 6 5'), C(17, 9, 3), P('M17 11a4 4 0 0 1 4 4v2')],
  map: [P('M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z'), P('M9 4v14M15 6v14')],
  copy: [R(9, 9, 11, 11, { rx: 2 }), P('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1')],
  more: [C(5, 12, 1.5), C(12, 12, 1.5), C(19, 12, 1.5)],
  headset: [P('M4 13a8 8 0 0 1 16 0'), R(2, 13, 4, 6, { rx: 2 }), R(18, 13, 4, 6, { rx: 2 }), P('M20 17v2a2 2 0 0 1-2 2h-3')],
  compass: [C(12, 12, 9), P('M16 8l-2 6-6 2 2-6z')],
  cart: [C(9, 20, 1.4), C(17, 20, 1.4), P('M3 3h2l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6')],
  wrench: [P('M15 4a4 4 0 0 0-4.5 5.2L8 12l3 3 2.8-2.5A4 4 0 0 0 19 8a4 4 0 0 0-4-4z'), P('M6 18l2.5-2.5')],
  hammer: [P('M3 20h18'), P('M6 20l4-9 3 3 2-6 2 1-1 6 4 1-1 3-3-1-1 3z')],
  brush: [R(4, 4, 7, 4, { rx: 1 }), P('M7.5 8v8M5 20h5')],
  snowflake: [P('M12 2v20M17 4.5l-10 15M17 19.5l-10-15M4 12h16')],
  car: [R(3, 9, 18, 8, { rx: 2 }), P('M4 13h16'), C(7, 17, 1.5), C(17, 17, 1.5), P('M6 9l1.5-4h9L18 9')],
  fridge: [R(6, 3, 12, 18, { rx: 2 }), P('M6 9h12M9 13v4M15 13v4')],
  satellite: [P('M4 14a8 8 0 0 1 8-8M6 12a4 4 0 0 1 4-4'), C(12, 12, 2), P('M12 12l8-5M12 12l-5 8')],
  aluminum: [R(3, 4, 18, 16, { rx: 1 }), P('M12 4v16M3 12h18')],
  box: [P('M21 8l-9-5-9 5v8l9 5 9-5z'), P('M3 8l9 5 9-5M12 13v8')],
  truck: [R(1, 8, 18, 8, { rx: 2 }), P('M5 16H1V8h18M15 16h-3M16 8V5h4l3 3v8h-3'), C(7, 17, 1.6), C(17, 17, 1.6)],
  broom: [P('M14 3l3 3-7 7-3-3zM11 13l-5 5M7 17l-2 2M16 8l3 3')],
  bug: [C(12, 12, 3), P('M12 9V5M12 15v4M9 11H5M15 11h4M9.5 9.5 6 6M14.5 9.5 18 6M9.5 14.5 6 18M14.5 14.5 18 18')],
  leaf: [P('M12 21V11'), P('M12 11C8 11 5 8 5 4c4 0 7 3 7 7zM12 11c4 0 7-3 7-7-4 0-7 3-7 7z')],
  camera: [R(3, 6, 18, 13, { rx: 2 }), C(9, 11, 2), P('M3 17l5-4 4 3 3-2 6 5')],
  book: [P('M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z'), P('M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5')],
  chef: [P('M5 11a2 2 0 0 1 4 0 2 2 0 0 1 4 0 2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z'), P('M12 16v5')],
  monitor: [R(3, 4, 18, 12, { rx: 2 }), P('M8 21h8M12 16v5')],
  smartphone: [R(7, 3, 10, 18, { rx: 2 }), P('M11 18h2')],
  dot: [C(12, 12, 3, { fill: '#FFFFFF', stroke: 'none' })],
};

const CATS: any = {
  plumber: [P('M15 4a4 4 0 0 0-4.5 5.2L8 12l3 3 2.8-2.5A4 4 0 0 0 19 8a4 4 0 0 0-4-4z'), P('M6 18l2.5-2.5'), P('M12 2c1 1.6 1.8 2.6 1.8 3.6a1.8 1.8 0 0 1-3.6 0C10.2 4.6 11 3.6 12 2z')],
  electrician: [P('M13 2 4 14h6l-1 8 9-12h-6z')],
  carpenter: [P('M3 20h18'), P('M6 20l4-9 3 3 2-6 2 1-1 6 4 1-1 3-3-1-1 3z')],
  painter: [R(4, 4, 7, 4, { rx: 1 }), P('M7.5 8v8M5 20h5')],
  ac: [P('M12 2v20M12 6l-3-3M12 6l3-3M12 12l-3-3M12 12l3-3M12 18l-3-3M12 18l3-3'), C(12, 12, 2)],
  mechanic: [P('M5 13l2-2 4 4-2 2zM3 16l2 2 3-3M14 6l4 4M16 4l4 4-9 9-4-4z')],
  appliance: [R(6, 3, 12, 18, { rx: 2 }), P('M6 9h12M9 6v2M9 13h6v5H9z')],
  mason: [R(3, 9, 8, 4), R(13, 9, 8, 4), R(3, 15, 8, 4), R(13, 15, 8, 4), R(11, 3, 2, 4)],
  welder: [P('M12 3v4M9 7h6l-1 4h-4zM12 11v3M8 18h8M10 18l-1 3M14 18l1 3')],
  tiler: [R(4, 4, 7, 7), R(13, 4, 7, 7), R(4, 13, 7, 7), R(13, 13, 7, 7)],
  gypsum: [R(4, 4, 16, 16, { rx: 1 }), P('M4 10h16M10 4v16')],
  satellite: [P('M4 14a8 8 0 0 1 8-8M6 12a4 4 0 0 1 4-4'), C(12, 12, 2), P('M12 12l8-5M12 12l-5 8')],
  lock: [R(3, 11, 18, 8, 2), P('M7 11V7a5 5 0 0 1 10 0v4')],
  locksmith: [C(9, 9, 4), P('M11 11l8 8M16 16l2-2M14 18l-2 2')],
  aluminum: [R(3, 4, 18, 16, { rx: 1 }), P('M12 4v16M3 12h18')],
  generator: [C(12, 12, 4), P('M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2')],
  solar: [R(3, 5, 18, 10, { rx: 1 }), P('M3 9h18M3 13h18M9 5v10M15 5v10M12 15v5M9 20h6')],
  mover: [P('M3 7l3-3h11l4 4v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z'), P('M8 20a2 2 0 1 0 0 .01M18 20a2 2 0 1 0 0 .01'), P('M8 12h8')],
  water: [P('M3 7l3-3h9l3 3v9H3z'), P('M7 16a2 2 0 1 0 0 .01M16 16a2 2 0 1 0 0 .01'), P('M10 3c1 1.4 1.6 2.2 1.6 3a1.6 1.6 0 0 1-3.2 0C8.4 5.2 9 4.4 10 3z')],
  cargo: [P('M2 6h11v9H2zM13 9h5l3 3v3h-8z'), C(6, 17, 1.6), C(17, 17, 1.6)],
  cleaning: [P('M14 3l3 3-7 7-3-3zM11 13l-5 5M7 17l-2 2M16 8l3 3')],
  pest: [C(12, 12, 3), P('M12 9V5M12 15v4M9 11H5M15 11h4M9.5 9.5 6 6M14.5 9.5 18 6M9.5 14.5 6 18M14.5 14.5 18 18')],
  garden: [P('M12 21V11'), P('M12 11C8 11 5 8 5 4c4 0 7 3 7 7zM12 11c4 0 7-3 7-7-4 0-7 3-7 7z')],
  tailor: [C(6, 6, 2.5), C(6, 18, 2.5), P('M8 7l8 4-8 4')],
  photo: [R(3, 6, 18, 13, { rx: 2 }), C(9, 11, 2), P('M3 17l5-4 4 3 3-2 6 5')],
  tutor: [P('M4 5h9a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z'), P('M15 8h4v9a2 2 0 0 1-2 2'), P('M8 4v3M11 4v3')],
  driver: [C(12, 12, 3), P('M12 3v3M12 18v3M3 12h3M18 12h3'), C(12, 12, 7)],
  chef: [P('M5 11a2 2 0 0 1 4 0 2 2 0 0 1 4 0 2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z'), P('M12 16v5')],
  event: [P('M12 3v4M8 5h8'), P('M5 9l2 8 5-3 5 3 2-8z')],
  barber: [C(6, 6, 2.5), C(6, 18, 2.5), P('M8 7l8 4-8 4')]
};
CATS.default = CATS.plumber;

function SvgGroup({ els, size, color, strokeWidth }: any) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round">
      {els.map((e: any, i: number) => {
        const [t, a] = e;
        if (t === 'path') return <Path key={i} d={a.d} fill={a.fill || 'none'} stroke={a.stroke || color} strokeWidth={a.strokeWidth || strokeWidth || 2} />;
        if (t === 'circle') return <Circle key={i} cx={a.cx} cy={a.cy} r={a.r} fill={a.fill || 'none'} stroke={a.stroke || color} strokeWidth={a.strokeWidth || strokeWidth || 2} />;
        if (t === 'rect') return <Rect key={i} x={a.x} y={a.y} width={a.width} height={a.height} rx={a.rx || 0} fill={a.fill || 'none'} stroke={a.stroke || color} strokeWidth={a.strokeWidth || strokeWidth || 2} />;
        return null;
      })}
    </Svg>
  );
}

export function Icon({ name, size = 24, color = palette.accent, strokeWidth }: any) {
  return <SvgGroup els={ICONS[name] || ICONS.home} size={size} color={color} strokeWidth={strokeWidth} />;
}
export function CategoryIcon({ id, size = 26, color = palette.accent }: any) {
  return <SvgGroup els={CATS[id] || CATS.default} size={size} color={color} strokeWidth={1.8} />;
}
