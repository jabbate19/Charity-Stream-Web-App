import React, {useState, useEffect, useRef} from 'react';
import StoreContent from './StoreContent/StoreContent';
import Cart from './Cart/Cart';
import './Store.css';
import {JG_FUNDRAISING_ID} from '../../App/constants.js';

let Icon = <svg className="icon" fill="white" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m495.891 418.109-70.162-70.162-77.782 77.781 70.163 70.163c21.479 21.479 56.303 21.479 77.782 0 21.478-21.479 21.478-56.303-.001-77.782z"/><path d="m220.622 433.657c3.838 0 7.678-1.465 10.606-4.394 5.858-5.858 5.858-15.355 0-21.213l-17.624-17.624 292.891-239.464c3.484-2.849 5.505-7.112 5.505-11.613v-124.349c0-8.284-6.716-15-15-15h-124.351c-4.501 0-8.764 2.021-11.613 5.505l-239.463 292.89-17.624-17.624c-5.857-5.857-15.355-5.858-21.213 0s-5.858 15.355 0 21.213l127.279 127.279c2.929 2.93 6.767 4.394 10.607 4.394zm197.99-361.482c5.857-5.858 15.355-5.858 21.213 0s5.858 15.355 0 21.213l-261.63 261.63-21.213-21.213z"/><path d="m93.891 495.891 70.162-70.162-77.781-77.782-70.163 70.163c-21.479 21.479-21.479 56.303 0 77.782 21.479 21.478 56.303 21.478 77.782-.001z"/><path d="m5.505 150.963 118.587 96.955 46.157-56.456-98.074-98.074c-5.858-5.857-5.858-15.355 0-21.213s15.355-5.858 21.213 0l95.946 95.946 47.291-57.842-85.662-104.774c-2.849-3.484-7.112-5.505-11.613-5.505h-124.35c-8.284 0-15 6.716-15 15v124.351c0 4.501 2.021 8.763 5.505 11.612z"/><path d="m408.051 280.772-17.624 17.624-6.756-8.263-39.792 32.533 11.139 11.139-21.213 21.213-13.268-13.268-40.839 33.389 18.698 15.287-17.624 17.624c-5.857 5.857-5.858 15.355 0 21.213s15.355 5.858 21.213 0l127.279-127.279c2.929-2.929 4.394-6.767 4.394-10.606 0-3.838-1.465-7.678-4.394-10.606-5.858-5.858-15.355-5.858-21.213 0z"/></svg>


function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

/** Responsible for constructing the store page component **/
const Store = ({selectedPlayer}) => {
    const[filterTag, setFilterTag] = useState('all');
    const[cartItems, setCartItems] = useState([]);
    const[player, setPlayer] = useState(selectedPlayer);
    const[showCart, setShowCart] = useState('no');

    const storeDiv = useRef();
    const itemAddRef = useRef();

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        storeDiv.current.style.height = `${window.screen.height * 0.8}px`;

        let lsGet = localStorage.getItem('filterTag');
        if(lsGet){
            setFilterTag(lsGet);
        }
        lsGet = localStorage.getItem('player');
        if(!selectedPlayer && lsGet){
            setPlayer(lsGet);
        } else if(selectedPlayer === ''){
            setPlayer('fastturtle123');
        }
        lsGet = localStorage.getItem('cartItems');
        if(lsGet){
            setCartItems(JSON.parse(lsGet));
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('filterTag', filterTag);
    }, [filterTag])
    useEffect(() => {
        localStorage.setItem('player', player);
    }, [player])
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems])

    const addItemToCart = (item) => {
        if(!cartItems.find(e => e.name === item.name)){
            setCartItems([...cartItems, item]);
        } else {
            if (!('power' in item)){
                changeCartAmount(item, 1);
            } else {
                let time = cartItems.find(e => e.name === item.name).time;
                if(time < 300){
                    changeEffectTime(item, time + 30);
                }
            }
        }

        itemAddRef.current.src = item.img;
        itemAddRef.current.dataset.show = 'yes';
        setTimeout(() => itemAddRef.current.dataset.show = 'no', 100)
    }

    const removeItemFromCart = (item) => {
        let index = cartItems.indexOf(item);
        if(index < cartItems.length){
            let tempArr = [...cartItems];
            tempArr.splice(index, 1);
            setCartItems(tempArr);
        } else {
            console.error('Cart: Index is out of bounds');
        }
    }

    const changeCartAmount = (item, change=0) => {
        let i = cartItems.find(e => e.name === item.name);
        if(i){
            i.amount += change;
            if(i.amount <= 0){
                removeItemFromCart(i);
            } else {
                forceUpdate();
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        } else {
            console.error("Item does not exist in cart");
        }
    } 

    const changeEffectPower = (item, value=0) => {
        let i = cartItems.find(e => e.name === item.name);
        if(i){
            i.power = value;
            forceUpdate();
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            console.error("Item does not exist in cart");
        }
    } 

    const changeEffectTime = (item, value=30) => {
        let i = cartItems.find(e => e.name === item.name);
        if(i){
            i.time = value;
            forceUpdate();
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            console.error("Item does not exist in cart");
        }
    } 

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            if(!('power' in item))
                total += (item.amount * item.price);
            else
                total += ((item.power + 1) * (item.time / 30 * item.price));
        });
        return total;
    }

    const proceedToCheckout = () => {
        if(cartItems.length === 0) {
            console.error("No items in cart!");
            return;
        }
        let stringsObj = "";
        for(let i = 0; i < cartItems.length; i++){
            let stringIndividual;
            switch(cartItems[i].type){
                case "effect":
                    //id, time, power
                    stringIndividual = "effect-";
                    stringIndividual += player;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].id;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].time;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].power;
                    break;
                case "mob":
                    //id, loop, dataTags
                    stringIndividual = "summon-";
                    stringIndividual += player;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].id;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].amount;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].optionalDataTag;
                    break;
                default:
                    //id, amount (items)
                    stringIndividual = "give-";
                    stringIndividual += player;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].id;
                    stringIndividual += "-";
                    stringIndividual += cartItems[i].amount;
                    stringIndividual += "-";
                    stringIndividual += "1";
                    break;
            }

            if(i !== cartItems.length - 1) stringIndividual += ",";

            console.log(stringIndividual);
            
            stringsObj += stringIndividual;
        }
        console.log(stringsObj);

        let JGURL = "http://link.justgiving.com/v1/fundraisingpage/donate/pageId/" 
            + JG_FUNDRAISING_ID
            + "?amount="
            + calculateTotal()
            + "&currency=USD&reference=bbcsh&message={jsonPOST}{jsonBlock:"
            + stringsObj + "}";

        console.log(JGURL);

        window.open(JGURL, "_blank");
    }

    const toggleCartMenu = () => {
        setShowCart(showCart === 'yes' ? 'no' : 'yes');
    }

    return(
        <div className='Store'>
            <button className='bg-csh-tertiary toggle-cart' onClick={toggleCartMenu} data-showcart={showCart}><span className='material-icons'>{showCart === 'yes' ? 'arrow_back' : 'shopping_cart'}</span></button>
            <img className='cart-add-item' ref={itemAddRef} src='' alt='item added to cart' data-show='no'></img>
            <Cart player={player} setPlayer={setPlayer} cartItems={cartItems} changeCartAmount={changeCartAmount} changeEffectPower={changeEffectPower} changeEffectTime={changeEffectTime} removeFromCart={removeItemFromCart} proceedToCheckout={proceedToCheckout} showCart={showCart} calculateTotal={calculateTotal} />
            <div className='store-window' ref={storeDiv}>
                <nav className='store-nav bg-csh-secondary-gradient'>
                    <span id='store-all' className='store-link' onClick={() => setFilterTag('all')}>{Icon}All</span>
                    <span id='a-tools' className='store-link' onClick={() => setFilterTag('tool')}>{Icon}Tools</span>
                    <span id='a-weapons' className='store-link' onClick={() => setFilterTag('weapon')}>{Icon}Weapons</span>
                    <span id='a-armor' className='store-link' onClick={() => setFilterTag('armor')}>{Icon}Armor</span>
                    <span id='a-food' className='store-link' onClick={() => setFilterTag('food')}>{Icon}Food</span>
                    <span id='a-materials' className='store-link' onClick={() => setFilterTag('material')}>{Icon}Materials</span>
                    <span id='a-effects' className='store-link' onClick={() => setFilterTag('effects')}>{Icon}Effects</span>
                    <span id='a-mobs' className='store-link' onClick={() => setFilterTag('mobs')}>{Icon}Mobs</span>
                </nav>
                <div className='store-content'>
                    <StoreContent filterTag={filterTag} addItemToCart={addItemToCart} />
                </div>
            </div>
        </div>
    );
}

export default Store;