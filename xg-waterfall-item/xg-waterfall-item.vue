<template>
	<view ref="waterfall-item" class="waterfall-item" :style="{left: left + 'px', top: top + 'px', width: width + 'px'}">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * 如果xg-waterfall组件属性autoLayout为假，则必须手动调用 calculateLayout() 方法进行瀑布流，在image组件中建议在load事件触发后调用
	 */
	export default {
		name: 'XgWaterfallItem',
		inject: ['waterfall'],
		data() {
			return {
				top: 0,
				left: 0,
			}
		},
		mounted() {
			this.$nextTick(function () {
				if (this.waterfall.autoLayout) {
					this.calculateLayout();
				}
			})
		},
		computed: {
			width() {
				return this.waterfall.realColumnWidth;
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
				const selector = uni.createSelectorQuery().in(this);
				selector.select('.waterfall-item').fields({size: true});
				selector.exec(data => {
					const waterfallItemHeight = data[0].height;
					
					const minColumnHeight = Math.min(...this.waterfall.columnsHeight);
					
					const minColumnIndex = this.waterfall.columnsHeight.indexOf(minColumnHeight);
					
					this.top = minColumnHeight;
					this.waterfall.columnsHeight[minColumnIndex] += waterfallItemHeight;
					this.left = this.waterfall.columnsLeft[minColumnIndex];
					
					this.waterfall.waterfallHeight = Math.max(...this.waterfall.columnsHeight);
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.waterfall-item {
		position: absolute;
		/* border-width: 6px;
		border-color: red; */
	}
</style>