import React from 'react';
import ReactDOM from 'react-dom';
import CategoryButton from './ui/category_button'
import AssetButton from './ui/asset_button'
//import './hud.css';

export default class HUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: this.props.categories[0],
            showMenu: true,
        }
    }

    render () {
        const assets = this.props.assetsFromFile;
        const curCategory = this.state.category;
        const selectAsset = this.props.selectAsset;

        return (
            <div>
                <div id="ground-top-panel">
                    <button id="back">Back</button>
                </div>
                <div id="UI-right-panel">
                    <div id="top-buttons"></div>
                    <button id="screenshot">Take a Screenshot</button>
                    <div id="camera-move">
                        <button id="camera-up" onClick={this.props.xUp}>&uarr;</button>
                        <div id="camera-move-horizontal">
                            <button id="camera-left" onClick={this.props.zUp}>&larr;</button>
                            <button id="camera-right" onClick={this.props.zDown} >&rarr;</button>
                        </div>
                        <button id="camera-down" onClick={this.props.xDown}>&darr;</button>
                    </div>
                    <button id="camera-zoom-in" onClick={this.props.yDown}>+</button>
                    <button id="camera-zoom-out" onClick={this.props.yUp}>-</button>
                    <button id="camera-position-reset" onClick={this.props.resetPosition}>Reset</button>
                </div>
                <div id="UI-selected-asset-options">
                    <span className="selected-asset-label-title">Currently selected:</span>
                    <span id="selected-asset-label"></span>
                    <button id="deselect">Deselect</button>
                    <button id="rotate">Rotate</button>
                    <button id="remove">Remove</button>
                </div>
                <div id="UI-bottom-panel" className={this.state.showMenu ? "open" : "closed"}>
                    <button onClick={this.toggleMenu.bind(this)} className="drawer-toggle">{this.state.showMenu ? "[Close Menu]" : "[Open Menu]"}</button>
                    <div id="asset-selection-menu">
                        <button id="vr-viewer-mode" onClick={this.props.toggleCamera}>First-Person Viewer</button>
                        <button id="vr-viewer-mode" onClick={this.props.toggleCamera}>First-Person Viewer</button>
                        {
                        this.props.categories.map((category, index) => (
                            <CategoryButton onClick={this.setCurrentCategory.bind(this, category)} key={index} category={category}/>
                        ))
                        }
                    </div>
                <div id="asset-picker">
                    {
                    Object.keys(assets).map(function(asset) {
                        if(curCategory === assets[asset].category)
                            return (
                                <AssetButton key={asset} item={assets[asset]} onClick={selectAsset.bind(this, assets[asset])}/>
                            );
                    })
                    }
                </div>
            </div>
        </div>
        );
    }

    toggleMenu() {
        const showMenu = this.state.showMenu;
        this.setState({showMenu: !showMenu});
    }
    setCurrentCategory(category) {
        this.setState({category: category});
    }
}