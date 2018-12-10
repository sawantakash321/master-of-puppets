import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_HOST;

export const skillsAPI = {
  addSkill(skill) {
    return axios.post('/skills', skill);
  },
  removeSkill(id) {
    return axios.delete('/skills/' + id);
  },
  getSkills() {
    return axios.get('/skills');
  }
};
