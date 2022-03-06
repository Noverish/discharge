import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { DATE_HEADER_NAME, NAME_HEADER_NAME } from 'src/envs';
import { PersonDao } from 'src/models';

export default function request(data?: { name: string, date: string }): Promise<PersonDao[]> {
  return new Promise((resolve, reject) => {
    const headers: AxiosRequestHeaders = (data)
      ? {
        [NAME_HEADER_NAME]: encodeURI(data.name),
        [DATE_HEADER_NAME]: encodeURI(data.date),
      }
      : {};

    axios({
      url: 'https://cyber.hyunsub.kim',
      headers: headers,
    }).then((res: AxiosResponse) => {
      resolve(res.data);
    }).catch((err) => {
      reject(err);
    });
  });
}
