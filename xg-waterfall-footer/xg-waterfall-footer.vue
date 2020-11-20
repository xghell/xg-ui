<template>
	<!-- #ifdef APP-NVUE -->
	<header>
		<slot></slot>
	</header>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<view id="footer">
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	// #ifndef APP-NVUE
	export default {
		name: 'XgWaterfallHeader',
		inject: ['waterfall'],
		updated() {
			const query = uni.createSelectorQuery().in(this);
			
			query.select('#footer').fields({size: true});
			
			query.exec(data => {
				this.waterfall.footerHeight = data[0].height;
			})
		},
	}
	// #endif
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	.header {
		position: absolute;
		z-index: 100;
	}
	/* #endif */
</style>