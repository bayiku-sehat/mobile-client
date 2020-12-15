// const baseUrl = 'http://localhost:4000/babies'

let apiUrl = 'http://localhost:3001';

export const fetchBabies = (url = `${apiUrl}/bayi`) => {
  console.log({url}, '<<< fetch babies');
  return (dispatch) => {
    dispatch({type: 'FETCH_BABIES_PENDING', payload: true});
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, '<<<fetch babies', url);
        dispatch({type: 'FETCH_BABIES_SUCCESS', payload: data});
      })
      .catch((err) => {
        console.log(err, '<<<< error fetch babies');
        dispatch({type: 'FETCH_BABIES_ERROR', payload: err});
      })
      .finally((_) => dispatch({type: 'FETCH_BABIES_PENDING', payload: true}));
  };
};

export const fetchBabyById = (id) => {
  console.log('fetch baby details:', id);
  return (dispatch) => {
    dispatch({type: 'FETCH_BABY_PENDING', payload: true});
    fetch(`${apiUrl}/bayi/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, '<<<fetch baby', id);
        dispatch({type: 'FETCH_BABY_SUCCESS', payload: data});
      })
      .catch((err) => {
        console.log(err, '<<<< error fetch baby');
        dispatch({type: 'FETCH_BABY_ERROR', payload: err});
      })
      .finally((_) => dispatch({type: 'FETCH_BABY_PENDING', payload: true}));
  };
};

export const addBaby = (newBaby) => {
  console.log('add baby:', newBaby);
  return (dispatch, getState) => {
    fetch(apiUrl + '/babies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBaby),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, '<<<< new baby');
        let newBabies = getState().babyReducer.babies.concat(data);
        dispatch({type: 'SET_BABIES', payload: newBabies});
      });
  };
};

export const editBaby = (payload) => {
  console.log('edit baby:', payload);
  const {id} = payload;
  delete payload.id;
  console.log(payload, '<< after delete id');
  return (dispatch, getState) => {
    fetch(apiUrl + '/babies/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, '<<<< updated baby');
        let updatedBabies = getState().babyReducer.babies.map((baby) => {
          if (+baby.id === +data.id) {
            return data;
          }
        });
        dispatch({type: 'SET_BABIES', payload: updatedBabies});
      });
  };
};

export const deleteBaby = (id) => {
  console.log('delete:', id);
  return (dispatch, getState) => {
    fetch(`${apiUrl}/babies/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, '<<<< DELETE');
        let newBabies = getState().babyReducer.babies.filter(
          (baby) => baby.id !== id,
        );
        dispatch({type: 'SET_BABIES', payload: newBabies});
      });
  };
};