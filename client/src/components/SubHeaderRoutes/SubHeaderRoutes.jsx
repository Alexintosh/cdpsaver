import React from 'react';
import PropTypes from 'prop-types';

import './SubHeaderRoutes.scss';

const SubHeaderRoutes = ({ data }) => {
  const locPathanme = window.location.pathname;

  return (
    <div className="sub-heading-wrapper sub-header-routes-wrapper">
      <div className="width-container">
        {
          data.map(({ lebel, pathname }, index) => {
            const active = locPathanme.includes(pathname);

            return (
              <div className={`sub-header-item ${active ? 'active' : 'not-active'}`} key={pathname}>
                <div className="label">{lebel}</div>

                {
                  (index < (data.length - 1))
                  && <i className="icon-chevron-right" />
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

SubHeaderRoutes.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SubHeaderRoutes;
