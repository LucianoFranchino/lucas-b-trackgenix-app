import {
  getTimesheetsError,
  getTimesheetsSuccess,
  getTimesheetsPending,
  deleteTimesheetsError,
  deleteTimesheetsSuccess,
  deleteTimesheetsPending,
  createTimesheetPending,
  createTimesheetSuccess,
  createTimesheetError,
  editTimesheetPending,
  editTimesheetSuccess,
  editTimesheetError
} from './actions';

export const getTimesheets = () => {
  return (dispatch) => {
    dispatch(getTimesheetsPending());
    fetch(`${process.env.REACT_APP_API_URL}/time-sheets`)
      .then((response) => response.json())
      .then((response) => {
        dispatch(getTimesheetsSuccess(response.data));
      })
      .catch((error) => {
        dispatch(getTimesheetsError(error));
      });
  };
};

export const deleteTimesheet = (id) => {
  return (dispatch) => {
    dispatch(deleteTimesheetsPending());
    fetch(`${process.env.REACT_APP_API_URL}/time-sheets/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error('Could not delete the timesheet');
        } else {
          dispatch(deleteTimesheetsSuccess(id));
        }
      })
      .catch((error) => {
        dispatch(deleteTimesheetsError(error));
      });
  };
};

export const createTimesheet = (newTimesheet) => {
  return (dispatch) => {
    dispatch(createTimesheetPending());
    fetch(`${process.env.REACT_APP_API_URL}/time-sheets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: newTimesheet.description,
        date: newTimesheet.date,
        hours: newTimesheet.hours,
        project: newTimesheet.project,
        employee: newTimesheet.employee,
        task: newTimesheet.task
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error('Could not create a new Timesheet');
        } else {
          dispatch(createTimesheetSuccess(response.data));
        }
      })
      .catch((error) => {
        dispatch(createTimesheetError(error));
      });
  };
};

export const editTimesheet = (id, timesheet) => {
  return (dispatch) => {
    dispatch(editTimesheetPending);
    fetch(`${process.env.REACT_APP_API_URL}/time-sheets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: timesheet.description,
        date: timesheet.date,
        hours: timesheet.hours,
        project: timesheet.project,
        employee: timesheet.employee,
        task: timesheet.task
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error('Could not edit the Timesheet');
        } else {
          dispatch(editTimesheetSuccess(response.data));
        }
      })
      .catch((error) => {
        dispatch(editTimesheetError(error));
      });
  };
};
