// methods to interact with byId stuff

import {SPLIT_SINGLE} from '../reference';
import {myIndexOf} from '../reducers/Traces'

const logOrDefault = (logsById, log) => (logsById[log] ? logsById[log].name : '');

export const mergeSplitWithLogName = (splitsById, logsById) => {
  return Object.values(splitsById).map((split) => ({
    ...split,
    originalLogName: logOrDefault(logsById, split.original_log),
    testLogName: logOrDefault(logsById, split.test_log),
    trainingLogName: logOrDefault(logsById, split.training_log)
  }));
};

export const splitsToLabel = (logsById, splitsById, splitIds) => {
  return splitIds.map((id) => {
    const split = splitsById[id];
    return {value: id, label: splitToLabel(logsById, split)};
  });
};

/* eslint-disable max-len */
const splitToLabel = (logsById, split) => {
  let label;
  if (!split) return '';
  if (split.type === SPLIT_SINGLE) {
    label = `Split #${split.id}, ${logOrDefault(logsById, split.original_log)}`;
  } else {
    label = `Split #${split.id}, logs ${logOrDefault(logsById, split.training_log)} and ${logOrDefault(logsById, split.test_log)}`;
  }
  return label;
};

export const mapJobs = (logsById, splitsById, jobsById, jobIds) => {
  return jobIds.map(id => {
    const job = jobsById[id];
    return {
      ...job,
      splitName: splitToLabel(logsById, splitsById[job.split_id])
    };
  });
};

export const mapTraces = (tracesById, inter_results, final_diff) => {
  return tracesById.map(trace => {
    return {
      ...trace,
      inter_result: (myIndexOf(inter_results, trace) !== -1) ? inter_results[myIndexOf(inter_results, trace)] : {duration:"NaN", class_results:"NaN"},
      final_diff: (myIndexOf(final_diff, trace) !== -1) ? final_diff[myIndexOf(final_diff, trace)] : {duration:"NaN", class_actual:"NaN"},
    };
  });
};
