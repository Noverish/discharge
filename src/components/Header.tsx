import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
}

export default ({ className }: Props) => {
  const navClasses = classnames('navbar navbar-default navbar-fixed-top', className);

  return (
    <nav className={navClasses}>
      <div className="container-fluid">
        <div className="navbar-header">
          <a href="/" className="navbar-brand">정신과 시간의 방</a>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="http://github/Noverish/discharge" target="_blank" rel="noopener noreferrer" className="btn btn-link">Github</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
