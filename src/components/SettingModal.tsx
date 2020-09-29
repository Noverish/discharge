import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NAME_HEADER_NAME, DATE_HEADER_NAME, TARGET_DATE_NAME } from 'src/envs';
import { RootState, setNowDate, setPeople, setSetting } from 'src/redux';
import { PersonDao } from 'src/models';
import request from 'src/api';

const LoginModal = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state: RootState) => state.setting);
  const [errMsg, setErrMsg] = useState('');

  const { name, date, target } = setting;

  const onSubmit = useCallback(() => {
    const name = (document.getElementById(NAME_HEADER_NAME) as HTMLInputElement).value;
    const date = (document.getElementById(DATE_HEADER_NAME) as HTMLInputElement).value;
    const target = (document.getElementById(TARGET_DATE_NAME) as HTMLInputElement).value;

    if (!name || !date) {
      setErrMsg('이름과 입대일을 입력해 주세요.');
      return;
    }

    if (isNaN(new Date(target).getTime())) {
      setErrMsg('올바른 \'돌아가고 싶은 날짜\'를 입력해 주세요.');
      return;
    }

    request({ name, date })
      .then((people: PersonDao[]) => {
        if (people.length === 0) {
          setErrMsg('해당 데이터는 존재하지 않습니다.');
        } else {
          if (target) {
            dispatch(setNowDate(target));
          } else {
            const transfer = people.find(v => v.name === name && v.join === date)!.transfer;
            dispatch(setNowDate(transfer));
          }
          dispatch(setPeople(people));
          dispatch(setSetting({ name, date, target }));
          (document.getElementById('cancel-btn') as HTMLButtonElement).click();
          setErrMsg('');
        }
      })
      .catch((err) => {
        alert(err.toString());
      });
  }, [dispatch]);

  return (
    <div id="myModal" className="modal fade" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title">본인의 정보 입력</h4>
          </div>
          <div className="modal-body">
            <p>이 데이터에 본인이 있는 것 같은 경우 본인의 실명과 입대일을 입력해주세요.</p>
            <form id="login-form" action="/action_page.php">
              <div className="form-group">
                <label>이름</label>
                <input type="text" className="form-control" id={NAME_HEADER_NAME} placeholder="홍길동" defaultValue={name} />
              </div>
              <div className="form-group">
                <label>입대일</label>
                <input type="text" className="form-control" id={DATE_HEADER_NAME} placeholder="2020-01-01" defaultValue={date} />
              </div>
              <div className="form-group">
                <label>돌아가고 싶은 날짜 (Optional)</label>
                <input type="text" className="form-control" id={TARGET_DATE_NAME} placeholder="2020-01-01" defaultValue={target} />
              </div>
            </form>
            {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onSubmit}>Apply</button>
            <button type="button" className="btn btn-default" data-dismiss="modal" id="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(LoginModal);