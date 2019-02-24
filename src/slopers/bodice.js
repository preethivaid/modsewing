import { STANDARD_MEASUREMENTS } from 'constants.js'
import { convertMeasurements } from 'measurements'	
import { absMovePen, 
				 relMovePen, 
				 drawAbsLine, 
				 drawRelLine, 
				 drawAbsBez } from 'svgHelpers/drawing'
import { calculateArmholeShoulderCenterFrontDart,
         calculateSideDart,
         calculateWaistDart } from 'slopers/darts'
import { quadraticBezierLength,
         calculateLineToLineIntersection,
         calculateLineToBezierIntersection,
         calculateCoordAlongLine } from 'svgHelpers/pathMath.js'


export const front = (size) => {

  const convertedMeasurements = convertMeasurements(STANDARD_MEASUREMENTS[size]);
  const fc = calculateFrontCoordinates(STANDARD_MEASUREMENTS[size], convertedMeasurements);

  const frontPath = [
    // Draw the sloper outline
    ...absMovePen({x: fc.x0, y: fc.y14}),
    ...drawAbsLine({x: fc.x0, y: fc.y0}),
    ...drawAbsLine({x: fc.x20, y: fc.y0}),
    ...drawAbsLine({x: fc.x19, y: fc.y1}),
    ...drawAbsLine({x: fc.x13, y: fc.y3}),
    ...drawAbsBez({x: fc.x16, y: fc.y5}, {x: fc.x18, y: fc.y9}),
    ...drawAbsBez({x: fc.x10, y: fc.y9}, {x: fc.x10, y: fc.y12}),
    ...drawAbsLine({x: fc.x14, y: fc.y15}),
    ...drawAbsLine({x: fc.x8, y: fc.y16}),
    ...drawAbsBez({x: fc.x9, y: fc.y13}, {x: fc.x5, y: fc.y7}),
    ...drawAbsLine({x: fc.x3, y: fc.y17}),
    ...drawAbsLine({x: fc.x1, y: fc.y18}),
    ...drawAbsBez({x: fc.x1, y: fc.y14}, {x: fc.x0, y: fc.y14}),

    // Waist darts
    ...absMovePen({x: fc.x5, y: fc.y0}),
    ...drawAbsLine({x: fc.x5, y: fc.y1}),
    ...drawAbsLine({x: fc.x2, y: fc.y2}),
    ...drawAbsLine({x: fc.x2, y: fc.y3}),
    ...drawAbsLine({x: fc.x5, y: fc.y4}),
    ...drawAbsLine({x: fc.x5, y: fc.y7}),

    ...absMovePen({x: fc.x5, y: fc.y1}),
    ...drawAbsLine({x: fc.x6, y: fc.y2}),
    ...drawAbsLine({x: fc.x6, y: fc.y3}),
    ...drawAbsLine({x: fc.x5, y: fc.y4}),

    // Armhole dart
    ...absMovePen({x: fc.x5, y: fc.y7}),
    ...drawAbsLine({x: fc.x11, y: fc.y11}),
    ...absMovePen({x: fc.x5, y: fc.y7}),
    ...drawAbsLine({x: fc.x12, y: fc.y10}),

    // Side dart
    ...absMovePen({x: fc.x5, y: fc.y7}),
    ...drawAbsLine({x: fc.x15, y: fc.y6}),
    ...absMovePen({x: fc.x5, y: fc.y7}),
    ...drawAbsLine({x: fc.x17, y: fc.y8}),

    ]

	return frontPath;
}



export const calculateFrontCoordinates = (measurements, convertedMeasurements) => {
  const cm = convertedMeasurements;
  const waistDartWidth = calculateWaistDart(measurements.waist, measurements.lowHip);
  const shoulderDartWidth = calculateArmholeShoulderCenterFrontDart(cm.cup);
  const sideDartWidth = calculateSideDart(cm.cup);
  const ease = 3/8;
  const shoulderDartMove = 1/4;
  const highHipFromBottom = cm.hip.low.depth - cm.hip.high.depth;

  let front = {};
  front.x0 = 0;
  front.x1 = cm.neck.front + shoulderDartMove;
  front.x2 = (cm.figureBreadth - waistDartWidth)/2;

  // ---Shoulder values
  const originalShoulderHeight = (cm.neck.front + 1/8)/2;
  const originalShoulderWidth = Math.sqrt(Math.pow(cm.shoulder + shoulderDartWidth, 2) - Math.pow(originalShoulderHeight, 2));

  front.x5 = cm.figureBreadth/2;
  front.x6 = (cm.figureBreadth + waistDartWidth)/2;

  front.x10 = cm.cross.front + shoulderDartWidth + 1/8;

  front.x13 = cm.waist.back + waistDartWidth + ease;

  front.x18 = cm.bust.front;
  front.x19 = cm.hip.high.back + ease;
  front.x20 = cm.hip.low.back + ease;

  front.y0 = 0;
  front.y1 = highHipFromBottom;
  front.y2 = cm.hip.low.depth - 1/2;
  front.y3 = cm.hip.low.depth;

  front.y5 = cm.hip.low.depth + 3;

  front.y14 = cm.hip.low.depth + cm.length.front - 3/8;

  front.y18 = cm.hip.low.depth + cm.length.front + cm.neck.front + 1/8;

  front.x16 = front.x13;

  let sideHeight = Math.sqrt(Math.pow(cm.side + sideDartWidth, 2) - Math.pow(front.x18 - front.x13, 2));

  front.y9 = cm.hip.low.depth + sideHeight;

  front.y12 = front.y14 - 3;

  // Armhole dart
  const armholeCenterY = front.y9 + (front.y12 - front.y9)/2;
  front.y10 = armholeCenterY - sideDartWidth/(2*Math.sqrt(2));
  front.y11 = armholeCenterY + sideDartWidth/(2*Math.sqrt(2));

  front.x11 = calculateLineToBezierIntersection({x: -100, y: front.y11},
                                                {x: 100, y: front.y11},
                                                {x: front.x18, y: front.y9},
                                                {x: front.x10, y: front.y9},
                                                {x: front.x10, y: front.y12}).x;
  front.x12 = calculateLineToBezierIntersection({x: -100, y: front.y10},
                                                {x: 100, y: front.y10},
                                                {x: front.x18, y: front.y9},
                                                {x: front.x10, y: front.y9},
                                                {x: front.x10, y: front.y12}).x;

  const armholeBottomLength = quadraticBezierLength({x: front.x18, y: front.y9},
                                                    {x: front.x10, y: front.y9},
                                                    {x: front.x10, y: front.y12});
  const shoulderBottomPoint = calculateCoordAlongLine({x: front.x10, y: front.y12},
                                                      {x: front.x1 + originalShoulderWidth, y: front.y18 - originalShoulderHeight},
                                                      cm.armhole.back - armholeBottomLength);
  front.y15 = shoulderBottomPoint.y;
  front.x14 = shoulderBottomPoint.x;

  const newShoulderLength = Math.sqrt(Math.pow(front.x14-front.x1, 2) + Math.pow(front.y15-front.y18, 2)) + shoulderDartWidth;
  const shoulderBottomDart = calculateCoordAlongLine({x: front.x14, y: front.y15},
                                                     {x: front.x1, y: front.y18},
                                                      (newShoulderLength - shoulderDartWidth)/2);
  const shoulderTopDart = calculateCoordAlongLine({x: front.x14, y: front.y15},
                                                  {x: front.x1, y: front.y18},
                                                  (newShoulderLength + shoulderDartWidth)/2);
  front.y17 = shoulderTopDart.y;

  front.y13 = front.y17 - 3;

  front.y7 = front.y14 - Math.sqrt(Math.pow(cm.figureLength, 2) - Math.pow(cm.figureBreadth/2, 2));

  front.x17 = calculateLineToBezierIntersection({x: -100, y: front.y7 + sideDartWidth/2},
                                         {x: 100, y: front.y7 + sideDartWidth/2},
                                         {x: front.x13, y: front.y3},
                                         {x: front.x16, y: front.y5},
                                         {x: front.x18, y: front.y9}).x;

  // ---
  front.y16 = shoulderBottomDart.y;
  front.x3 = shoulderTopDart.x;
  front.x8 = shoulderBottomDart.x;
  front.x9 = front.x8;

  front.x4 = calculateLineToLineIntersection({x: front.x5, y: front.y7},
                                             {x: front.x3, y: front.y17},
                                             {x: -100, y: front.y12},
                                             {x: 100, y: front.y12}).x;

  front.x7 = calculateLineToLineIntersection({x: front.x5, y: front.y7},
                                             {x: front.x8, y: front.y16},
                                             {x: -100, y: front.y12},
                                             {x: 100, y: front.y12}).x;

  front.x15 = calculateLineToBezierIntersection({x: -100, y: front.y7 - sideDartWidth/2},
                                             {x: 100, y: front.y7 - sideDartWidth/2},
                                             {x: front.x13, y: front.y3},
                                             {x: front.x16, y: front.y5},
                                             {x: front.x18, y: front.y9}).x;

  front.y4 = front.y7 - 3/4;
  front.y6 = -calculateLineToBezierIntersection({x: -100, y: front.y7 - sideDartWidth/2},
                                             {x: 100, y: front.y7 - sideDartWidth/2},
                                             {x: front.x13, y: front.y3},
                                             {x: front.x16, y: front.y5},
                                             {x: front.x18, y: front.y9}).y;

  front.y8 = -calculateLineToBezierIntersection({x: -100, y: front.y7 + sideDartWidth/2},
                                             {x: 100, y: front.y7 + sideDartWidth/2},
                                             {x: front.x13, y: front.y3},
                                             {x: front.x16, y: front.y5},
                                             {x: front.x18, y: front.y9}).y;

  return front;
}