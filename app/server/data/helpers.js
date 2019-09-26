import _ from 'lodash';
import simplifyPoints from './simplify';

export const getTimestampGroup = timestamp =>
  Math.round(timestamp / 10000) * 10000;

export const getTimestampGroupRange = (start, end) => {
  const startGroup = getTimestampGroup(start);
  const endGroup = getTimestampGroup(end);

  const timestampGroups = Array((endGroup - startGroup) / 10000 + 1).fill(null);

  return timestampGroups.map(
    (timestampGroup, index) => startGroup + index * 10000
  );
};

export const getTimestampGroups = (data, group) => Object.keys(data[group]);

export const getClosestTimestamp = (timestamps, timestamp) =>
  timestamps.reduce((prev, curr) =>
    Math.abs(curr - timestamp) < Math.abs(prev - timestamp) ? curr : prev
  );

export const getClosestIndexes = (data, timestamp) => {
  const indexes = {};
  Object.keys(data).forEach(group => {
    indexes[group] = getClosestIndex(data, timestamp, group);
  });
  return indexes;
};

export const getClosestIndex = (data, timestamp, group) => {
  const timestampGroup = getTimestampGroup(timestamp);
  const timestamps = _.get(data, [group, `_${timestampGroup}`, 'times'], []);

  if (timestamps.length === 0) {
    return { timestampGroup: null, index: null };
  }

  const closestTimestamp = getClosestTimestamp(timestamps, timestamp);
  const index = timestamps.findIndex(ts => ts === closestTimestamp);
  return { timestampGroup, index };
};

export const getClosestValue = (data, timestampGroup, index, group, channel) =>
  _.get(data, [group, `_${timestampGroup}`, channel, index], null);

export const getSimplifiedPoints = points => {
  let simplifiedPoints = points;
  const thresholds = [
    0.1,
    0.2,
    0.3,
    0.5,
    0.75,
    1.0,
    1.25,
    1.5,
    2,
    2.5,
    3,
    4,
    5
  ];

  while (simplifiedPoints.length > 500 || thresholds.length === 0) {
    const threshold = thresholds.shift();
    simplifiedPoints = simplifyPoints(points, threshold, true);
  }

  return simplifiedPoints;
};
