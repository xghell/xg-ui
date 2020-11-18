<template>
	<!-- #ifdef APP-NVUE -->
	<header>
		<slot></slot>
	</header>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<view id="header" class="header" :style="{left: left + 'px', top: top + 'px', width: width + 'px'}">
		<slot></slot>
	</view>
	<!-- #endif -->
</template>

<script>
	// #ifndef APP-NVUE
	export default {
		name: 'XgWaterfallHeader',
		inject: ['waterfall'],
		data() {
			return {
				top: 0,
				left: 0,
			}
		},
		mounted() {
			this.$nextTick(function(){
				this.calculateLayout();
			})
			this.selector = uni.createSelectorQuery().in(this);
		},
		destroyed() {
			this.selector = null;
		},
		computed: {
			width() {
				return this.waterfall.waterfallWidth;
			}
		},
		methods: {
			calculateLayout() {
				if (!this._hasLayouted) {
					this._hasLayouted = true;
					
					this.reCalculateLayout();
				}
			},
			reCalculateLayout() {
				this.selector.select('#header').fields({size: true});
				this.selector.exec(data => {
					const headerHeight = data[0].height;
					
					const maxColumnHeight = Math.max(...this.waterfall.columnsHeight);
					
					const maxColumnIndex = this.waterfall.columnsHeight.indexOf(maxColumnHeight);
					
					this.top = maxColumnHeight;
					
					this.waterfall.columnsHeight = this.waterfall.columnsHeight.map(item => {
						return maxColumnHeight + headerHeight;
					});
					this.left = 0;
					
					this.waterfall.waterfallHeight = Math.max(...this.waterfall.columnsHeight);
				})
			}
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