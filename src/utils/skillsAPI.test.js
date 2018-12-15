/* global describe, it, afterEach, expect, jest */
import { skillsAPI } from './skillsAPI';
import nock from 'nock';

const endpoint = process.env.REACT_APP_API_HOST;

describe('skillsAPI', () => {
  it('Fetches skills', () => {
    const req = nock(endpoint)
      .get('/skills')
      .reply(200, []);

    return skillsAPI.getSkills().then(() => {
      expect(req.isDone()).toBeTruthy();
      expect(nock.pendingMocks().length).toEqual(0);
    });
  });

  it('Adds skills', () => {
    const skill = {};

    const req = nock(endpoint)
      .post('/skills')
      .reply(201, {});

    return skillsAPI.addSkill(skill).then(() => {
      expect(req.isDone()).toBeTruthy();
      expect(nock.pendingMocks().length).toEqual(0);
    });
  });

  it('Removes skills', () => {
    const req = nock(endpoint)
      .delete('/skills/1')
      .reply(200, '');

    return skillsAPI.removeSkill(1).then(() => {
      expect(req.isDone()).toBeTruthy();
      expect(nock.pendingMocks().length).toEqual(0);
    });
  });
});
