import React, { Component } from "react";
import AFRAME from "aframe";
import { Scene } from "aframe-react";
import { connect } from "react-redux";

import { insertAsset, selectAsset } from "../actions/grid_actions";
import { updatePosition } from "../actions/camera_actions";

// Scene Assets
import CeilingUnit from "./assets/ceiling_unit";
import CameraTP from "./assets/camera_tp";
import CameraFP from "./assets/camera_fp";
import QsetAsset from "./assets/qset_asset";
import FloorUnit from "./assets/floor_unit";
import Skybox from "./assets/skybox";

export class VRScene extends Component {
	renderAssets() {
		const assets = this.props.assets;
		const selectAsset = this.props.selectAsset;
		const currentX = this.props.currentX;
		const currentZ = this.props.currentZ;

		const mappedAssets = this.props.grid.map(
			(row, rowIndex) =>
				row.map((column, colIndex) => {
					return column !== "0" ? (
						<QsetAsset
							x={colIndex}
							z={rowIndex}
							onClick={selectAsset.bind(
								this,
								assets[column.id],
								colIndex,
								rowIndex
							)}
							data={assets[column.id]}
							rotation={column.rotation}
							isSelected={currentX === colIndex && currentZ === rowIndex}
							key={`${rowIndex} ${colIndex}`}
						/>
					) : null;
				}, this),
			this
		);
		return mappedAssets;
	}

	renderCeiling() {
		if (this.props.thirdPerson) return null;
		const mappedCeiling = this.props.grid.map((row, rowIndex) =>
			row.map((column, colIndex) => (
				<CeilingUnit
					x={colIndex}
					z={rowIndex}
					key={`${rowIndex} ${colIndex}`}
				/>
			))
		);
		return mappedCeiling;
	}

	renderFloor() {
		const selectedAssetId = this.props.selectedAsset
			? this.props.selectedAsset.id
			: null;

		const insertAsset = this.props.insertAsset;

		const mappedFloor = this.props.grid.map(
			(row, rowIndex) =>
				row.map(
					(column, colIndex) => (
						<FloorUnit
							thirdPerson={this.props.thirdPerson}
							selectedAssetId={selectedAssetId}
							x={colIndex}
							z={rowIndex}
							onClick={insertAsset}
							key={`${rowIndex} ${colIndex}`}
							grid={this.props.grid}
						/>
					),
					this
				),
			this
		);
		return mappedFloor;
	}

	render() {
		if (!this.props.grid || !this.props.position || !this.props.assets)
			return <div>Loading</div>;
		else {
			const assets = this.props.assets;
			return (
				<Scene className="vr-scene">
					<a-assets>
						<img
							id="ceilingTexture"
							alt="sorry"
							src="assets/CEILING_TILE.jpg"
						/>
						{Object.keys(assets).map(asset => {
							if (assets[asset].objSrc) {
								return (
									<a-asset-item
										id={asset + "-obj"}
										src={assets[asset].objSrc}
										key={`${asset}-obj`}
									/>
								);
							}
						})}
						{Object.keys(assets).map(asset => {
							if (assets[asset].mtlSrc) {
								return (
									<a-asset-item
										id={asset + "-mtl"}
										src={assets[asset].mtlSrc}
										key={`${asset}-mtl`}
									/>
								);
							}
						})}
					</a-assets>
					<Skybox />
					<CameraFP
						active={!this.props.thirdPerson}
						position={this.props.position}
					/>
					<CameraTP
						active={this.props.thirdPerson}
						position={this.props.position}
					/>
					{this.renderFloor()}
					{this.renderAssets()}
					{this.renderCeiling()}
				</Scene>
			);
		} //end else
	}
}

function mapStateToProps({ position, data, grid }) {
	return {
		position: { x: position.x, y: position.y, z: position.z },
		thirdPerson: position.thirdPerson,
		assets: data.assets,
		grid: grid.grid,
		currentX: grid.currentX,
		currentZ: grid.currentZ,
		selectedAsset: grid.selectedAsset
	};
}

export default connect(mapStateToProps, {
	insertAsset,
	selectAsset
})(VRScene);
