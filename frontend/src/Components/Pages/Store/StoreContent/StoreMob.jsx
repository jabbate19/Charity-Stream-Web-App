import React from 'react';
import PropTypes from 'prop-types';
import { BACKENDURL } from '../../../App/constants';

const StoreMob = ({ mob, addItemToCart }) => (
  <span tabIndex={0} role="button" className="store-item bg-csh-tertiary" onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={mob.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      <img className="store-item-image" src={`${BACKENDURL}/images/mobs/${mob.id}-full.jpg`} alt={mob.name} />
      <img className="store-item-icon" src={`${BACKENDURL}/images/mobs/${mob.id}.png`} alt={mob.name} />
      <p className="store-item-name">{mob.name}</p>
      <p className="store-item-price">
        $
        {mob.price.toFixed(2)}
      </p>
    </div>
    <div className="store-item-description">
      <dl className="store-item-stats">
        <span>
          <dt>Description</dt>
          <dd>{mob.description}</dd>
        </span>
      </dl>
    </div>
    <span className="add-cart material-icons md-36">add_shopping_cart</span>
  </span>
);

StoreMob.propTypes = {
  mob: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
  }).isRequired,
  addItemToCart: PropTypes.func.isRequired,
};

export default StoreMob;
