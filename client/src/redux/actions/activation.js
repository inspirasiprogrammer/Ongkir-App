import axios from 'axios'

export const activationState = {
  type: '',
  message: '',
  expired: false
}

export const ACTIVATION_SUCCESS = 'ACTIVATION_SUCCESS'
export const ACTIVATION_FAILED = 'ACTIVATION_FAILED'
export const ACTIVATION_CLEANUP = 'ACTIVATION_CLEANUP'

axios.interceptors.response.use((res) => {
  if (res.headers['content-type'] === 'application/json') {
    res.headers['accept'] = 'application/json'
    res.headers['content-type'] = 'application/json'
    res.config.headers['Accept'] = 'application/json'
    res.config.headers['Content-Type'] = 'application/json'
  }
  return res
})

export const activationActionCreator = (type, payload) => (dispatch) => {
  axios
    .get(`/api/user/activation/${payload.id}`)
    .then(({ data }) => {
      dispatch({
        type: type,
        payload: {
          type: ACTIVATION_SUCCESS,
          message: data.success
        }
      })
    })
    .catch((err) => {
      dispatch({
        type: ACTIVATION_FAILED,
        payload: {
          type: ACTIVATION_FAILED,
          message: err.response.data.error,
          expired: err.response.data.expired
        }
      })
    })
}
