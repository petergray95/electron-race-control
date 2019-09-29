import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { flatten } from 'flat';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import { BaseDataSessionLive, BaseDataSessionHistoric } from './base';
import {
  getTimestampGroup,
  getTimestampGroups,
  getTimestampGroupRange,
  getClosestIndexes,
  getClosestValue,
  getSimplifiedPoints
} from './helpers';

const { DRIVERS, PACKETS, TEAMS, TRACKS, TYRES, WEATHER } = constants;

const getDriver = (data, timestampGroup, index, participantId) => {
  const driver =
    DRIVERS[
      getClosestValue(
        data,
        timestampGroup,
        index,
        'participants',
        `m_participants.${participantId}.m_driverId`
      )
    ];

  if (driver) {
    return driver;
  }

  return { abbreviation: '', firstName: '', lastName: '' };
};

export class F12019SessionLive extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'Live';
    this.client = new F1TelemetryClient();

    this.client.on(PACKETS.session, message =>
      this.parseMessage(PACKETS.session, message)
    );
    this.client.on(PACKETS.motion, message =>
      this.parseMessage(PACKETS.motion, message)
    );
    this.client.on(PACKETS.lapData, message =>
      this.parseMessage(PACKETS.lapData, message)
    );
    this.client.on(PACKETS.event, message =>
      this.parseMessage(PACKETS.event, message)
    );
    this.client.on(PACKETS.participants, message =>
      this.parseMessage(PACKETS.participants, message)
    );
    this.client.on(PACKETS.carSetups, message =>
      this.parseMessage(PACKETS.carSetups, message)
    );
    this.client.on(PACKETS.carTelemetry, message =>
      this.parseMessage(PACKETS.carTelemetry, message)
    );
    this.client.on(PACKETS.carStatus, message =>
      this.parseMessage(PACKETS.carStatus, message)
    );
  }

  start() {
    this.client.start();
    this.isRunning = true;
  }

  stop() {
    this.client.stop();
    this.isRunning = false;
  }

  parseMessage(messageType, message) {
    const start = performance.now();

    const timestamp = new Date().getTime();
    const timestampRound = getTimestampGroup(timestamp);

    const messageFlat = flatten(message);

    Object.entries(messageFlat).forEach(([key, value]) => {
      const data = _.get(
        this.data,
        [messageType, key, `_${timestampRound}`],
        []
      );
      data.push(value);
      _.set(this.data, [messageType, key, `_${timestampRound}`], data);
    });

    const times = _.get(
      this.data,
      [messageType, 'times', `_${timestampRound}`],
      []
    );
    times.push(timestamp);
    _.set(this.data, [messageType, 'times', `_${timestampRound}`], times);

    const duration = performance.now() - start;

    this.addMessage(duration.toFixed(2));
  }
}

export class F12019SessionHistoric extends BaseDataSessionHistoric {
  constructor() {
    super();
    this.participants = [...Array(20).keys()].reduce(
      (o, key) => ({
        ...o,
        [key]: []
      }),
      {}
    );

    this.laps = [...Array(20).keys()].reduce(
      (o, key) => ({
        ...o,
        [key]: []
      }),
      {}
    );
  }

  getDetails() {
    const data = _.get(this.data, ['data'], {});
    const timestampGroups = getTimestampGroups(data, 'session');
    const lastTimestampGroup = timestampGroups[
      timestampGroups.length - 1
    ].replace('_', '');

    const sessionTimes = data.session[`_${lastTimestampGroup}`].times;

    return {
      track:
        TRACKS[
          getClosestValue(
            data,
            lastTimestampGroup,
            sessionTimes.length - 1,
            'session',
            `m_trackId`
          )
        ],
      weather:
        WEATHER[
          getClosestValue(
            data,
            lastTimestampGroup,
            sessionTimes.length - 1,
            'session',
            `m_weather`
          )
        ]
    };
  }

  getParticipants() {
    const data = _.get(this.data, ['data'], {});
    const timestampGroups = getTimestampGroups(data, 'participants');
    const lastTimestampGroup = timestampGroups[
      timestampGroups.length - 1
    ].replace('_', '');

    const participantTimes = data.participants[`_${lastTimestampGroup}`].times;

    const carIds = [...Array(20).keys()];
    const participants = {};

    carIds.forEach(carId => {
      const participant = {
        id: uuid(),
        carId,
        sessionId: this.id,
        laps: [],
        driver: null,
        name: null,
        nationality: null,
        raceNumber: null,
        team: null
      };

      participant.driver = getDriver(
        data,
        lastTimestampGroup,
        participantTimes.length - 1,
        participant.id
      );
      participant.name = getClosestValue(
        data,
        lastTimestampGroup,
        participantTimes.length - 1,
        'participants',
        `m_participants.${carId}.m_name`
      );
      participant.nationality = getClosestValue(
        data,
        lastTimestampGroup,
        participantTimes.length - 1,
        'participants',
        `m_participants.${carId}.m_nationality`
      );
      participant.raceNumber = getClosestValue(
        data,
        lastTimestampGroup,
        participantTimes.length - 1,
        'participants',
        `m_participants.${carId}.m_raceNumber`
      );
      participant.team =
        TEAMS[
          getClosestValue(
            data,
            lastTimestampGroup,
            participantTimes.length - 1,
            'participants',
            `m_participants.${carId}.m_teamId`
          )
        ];

      participants[carId] = participant;
    });
    return participants;
  }

  getLapInfo(data, carId, indexes, startTime, endTime, lapTime = null) {
    const participantId = this.participants[carId].id;

    let lap = {
      id: uuid(),
      sessionId: this.id,
      participantId,
      carId,
      startTime,
      endTime,
      number: getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carId}.m_currentLapNum`
      ),
      calculatedLapTime: null,
      lapTime,
      isFullLap: null,
      sector1Time: getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carId}.m_sector1Time`
      ),
      sector2Time: getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carId}.m_sector2Time`
      ),
      isValid: !getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carId}.m_currentLapInvalid`
      ),
      fuelInTank: getClosestValue(
        data,
        indexes.carStatus.timestampGroup,
        indexes.carStatus.index,
        'carStatus',
        `m_carStatusData.${carId}.m_fuelInTank`
      ),
      tyreCompound:
        TYRES[
          getClosestValue(
            data,
            indexes.carStatus.timestampGroup,
            indexes.carStatus.index,
            'carStatus',
            `m_carStatusData.${carId}.m_actualTyreCompound`
          )
        ],
      tyreAllocatedCompound:
        TYRES[
          getClosestValue(
            data,
            indexes.carStatus.timestampGroup,
            indexes.carStatus.index,
            'carStatus',
            `m_carStatusData.${carId}.m_tyreVisualCompound`
          )
        ],
      sector1SpeedTrap: null,
      sector2SpeedTrap: null,
      sector3SpeedTrap: null
    };

    lap = {
      ...lap,
      sector1Time: lap.sector1Time !== 0 ? lap.sector1Time : null,
      sector2Time: lap.sector2Time !== 0 ? lap.sector2Time : null
    };

    lap = {
      ...lap,
      sector3Time:
        lap.lapTime && lap.sector1Time && lap.sector2Time
          ? lap.lapTime - lap.sector2Time - lap.sector1Time
          : null
    };

    // get speed trap info
    if (lap.sector1Time) {
      const sectorIndexes = getClosestIndexes(
        data,
        lap.startTime + lap.sector1Time * 1000
      );
      console.log(lap.sector1Time, sectorIndexes);
      lap.sector1SpeedTrap = getClosestValue(
        data,
        sectorIndexes.carTelemetry.timestampGroup,
        sectorIndexes.carTelemetry.index,
        'carTelemetry',
        `m_carTelemetryData.${carId}.m_speed`
      );
      console.log(lap);
    }

    if (lap.sector2Time) {
      const sectorIndexes = getClosestIndexes(
        data,
        lap.startTime + lap.sector1Time * 1000 + lap.sector2Time * 1000
      );
      lap.sector2SpeedTrap = getClosestValue(
        data,
        sectorIndexes.carTelemetry.timestampGroup,
        sectorIndexes.carTelemetry.index,
        'carTelemetry',
        `m_carTelemetryData.${carId}.m_speed`
      );
    }

    if (lap.sector3Time) {
      const sectorIndexes = getClosestIndexes(data, lap.endTime);
      lap.sector3SpeedTrap = getClosestValue(
        data,
        sectorIndexes.carTelemetry.timestampGroup,
        sectorIndexes.carTelemetry.index,
        'carTelemetry',
        `m_carTelemetryData.${carId}.m_speed`
      );
    }

    return lap;
  }

  getLaps() {
    const carCursors = [...Array(20).keys()].reduce(
      (o, key) => ({
        ...o,
        [key]: { cursor: { lapNumber: null, startTime: null } }
      }),
      {}
    );

    const laps = [...Array(20).keys()].reduce(
      (o, key) => ({
        ...o,
        [key]: {}
      }),
      {}
    );

    const data = _.get(this.data, ['data'], {});
    const lapData = _.get(data, ['lapData'], {});

    Object.keys(lapData).forEach((timestampGroup, timestampGroupIndex) => {
      const timestamps = lapData[timestampGroup].times;
      timestamps.forEach((timestamp, timestampIndex) => {
        const currentIndexes = getClosestIndexes(data, timestamp);

        Object.keys(carCursors).forEach(carId => {
          const carCursor = carCursors[carId];

          const lapNumber = getClosestValue(
            data,
            currentIndexes.lapData.timestampGroup,
            currentIndexes.lapData.index,
            'lapData',
            `m_lapData.${carId}.m_currentLapNum`
          );

          if (!carCursor.startTime) {
            carCursor.startTime = timestamp;
          }

          if (!carCursor.lapNumber) {
            carCursor.lapNumber = lapNumber;
          }

          if (carCursor.lapNumber !== lapNumber) {
            // We have just completed a lap
            const lapCompleteTimestamp = timestamps[timestampIndex - 1];
            const previousIndexes = getClosestIndexes(
              data,
              lapCompleteTimestamp
            );

            let lap = this.getLapInfo(
              data,
              carId,
              previousIndexes,
              carCursor.startTime,
              lapCompleteTimestamp,
              getClosestValue(
                data,
                currentIndexes.lapData.timestampGroup,
                currentIndexes.lapData.index,
                'lapData',
                `m_lapData.${carId}.m_lastLapTime`
              )
            );

            lap = {
              ...lap,
              isFullLap: true,
              calculatedLapTime:
                (lapCompleteTimestamp - carCursor.startTime) / 1000
            };

            laps[carId][lap.id] = lap;

            carCursor.lapNumber = lapNumber;
            carCursor.startTime = timestamp;
          }

          if (
            timestampGroupIndex + 1 === Object.keys(lapData).length &&
            timestampIndex + 1 === timestamps.length &&
            lapNumber !== 0
          ) {
            let lap = this.getLapInfo(
              data,
              carId,
              currentIndexes,
              carCursor.startTime,
              timestamp
            );

            lap = {
              ...lap,
              isFullLap: false,
              calculatedLapTime: timestamp - carCursor.startTime
            };

            laps[carId][lap.id] = lap;
          }
        });
      });
    });
    return laps;
  }

  exportLap(carId: string, lapId: string, simplify: boolean = true) {
    const lap = this.getLap(carId, lapId);

    const channels = [
      ['carTelemetry', 'm_carTelemetryData.0.m_speed'],
      ['carTelemetry', 'm_carTelemetryData.0.m_throttle'],
      ['carTelemetry', 'm_carTelemetryData.0.m_brake']
    ];

    const timeGroups = getTimestampGroupRange(lap.startTime, lap.endTime);

    const output = {
      session: this.getStoreConfig(),
      lap,
      participant: this.participants[lap.carId],
      data: {}
    };

    channels.forEach(([group, channel]) => {
      const key = `${group}.${channel}`;
      const dataArray = [];

      timeGroups.forEach((timeGroup, groupIndex) => {
        const groupData = _.get(
          this.data,
          ['data', group, `_${timeGroup}`],
          {}
        );

        let subTimes = [];
        let subValues = [];

        switch (groupIndex) {
          case 0: {
            const firstIndex = groupData.times.findIndex(
              time => time >= lap.startTime
            );
            subTimes = groupData.times.slice(firstIndex);
            subValues = groupData[channel].slice(firstIndex);
            break;
          }
          case groupData.length - 1: {
            const lastIndex = groupData.times.findIndex(
              time => time >= lap.endTime
            );
            subTimes = groupData.times.slice(0, lastIndex);
            subValues = groupData[channel].slice(0, lastIndex);
            break;
          }
          default: {
            subTimes = groupData.times;
            subValues = groupData[channel];
            break;
          }
        }
        subTimes.forEach((time, index) => {
          dataArray.push({ time, value: subValues[index] });
        });
      });

      output.data[key] = simplify ? getSimplifiedPoints(dataArray) : dataArray;
    });

    fs.writeFile(
      `./EXPORT_DATA/${this.name}_${lap.number}.json`,
      JSON.stringify(output),
      'utf8',
      () => {}
    );
  }
}
