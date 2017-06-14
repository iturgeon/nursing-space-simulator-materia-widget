import React from "react";

export default class AssetButton extends React.Component {
	render() {
		return (
			<button
				className={
					this.props.selectedAsset &&
						this.props.selectedAsset.asset.id === this.props.item.id
						? "asset asset-selected-icon"
						: "asset"
				}
				data-category={this.props.item.category}
				data-title={this.props.item.title}
				id={this.props.item.id}
				onClick={this.props.onClick}
				style={{
					background:
						"url(" + this.props.item.buttonSource + ") no-repeat center center",
					backgroundSize: "100% 100%"
				}}
			/>
		);
	}
}
