import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const IconLink = ({ to, Icon, label, testid }) => {
  return (
    <Link to={to} className="link" data-testid={testid}>
      <div className="link-container">
        <div className="link-icon">
          <Icon />
        </div>
        <div className="link-label">{label}</div>
      </div>
    </Link>
  );
};

IconLink.propTypes = {
  to: PropTypes.string.isRequired,
  Icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  label: PropTypes.node.isRequired,
  testid: PropTypes.string
};

export default IconLink;
