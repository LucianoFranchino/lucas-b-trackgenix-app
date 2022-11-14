import {
  getTaskSuccess,
  getTaskPending,
  getTaskError,
  deleteTaskSuccess,
  deleteTaskPendig,
  deleteTaskError,
  createTaskSuccess,
  createTaskPendig,
  createTaskError
} from './actions';

export const getTask = () => {
  return (dispatch) => {
    dispatch(getTaskPending());
    return fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then((response) => response.json())
      .then((response) => {
        dispatch(getTaskSuccess(response.data));
        return response.data;
      })
      .catch((error) => {
        dispatch(getTaskError(error.toString()));
      });
  };
};

export const deleteTask = (id) => {
  return (dispatch) => {
    dispatch(deleteTaskPendig());
    fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error(response.message);
        } else dispatch(deleteTaskSuccess(id));
      })
      .catch((error) => {
        dispatch(deleteTaskError(error.toString()));
      });
  };
};

export const createTask = (description) => {
  return (dispatch) => {
    dispatch(createTaskPendig());
    fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(description)
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          throw new Error(response.message);
        } else dispatch(createTaskSuccess(description));
      })
      .catch((error) => {
        dispatch(createTaskError(error.toString()));
      });
  };
};
