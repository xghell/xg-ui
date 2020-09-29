<template>
	<!-- #ifndef APP-NVUE -->
	<scroll-view class="scroll-container" id="xg-tab-title" :scroll-y="vertical" :scroll-x="!vertical" :scroll-with-animation="animation" :show-scrollbar="showScrollbar" :scroll-top="scrollTop" :scroll-left="scrollLeft" @scroll="scroll">
	<!-- #endif -->
	
	<!-- #ifdef APP-NVUE -->
	<scroller class="scroll-container" ref="xg-tab-title" :class="{'horizon-layout': !vertical}" :show-scrollbar="showScrollbar" :scroll-direction="vertical ? 'vertical' : 'horizontal'">
	<!-- #endif -->
	
		<view ref="tab-title-content" :class="{'horizon-layout': !vertical}">
			<slot></slot>
		</view>
		
	<!-- #ifdef APP-NVUE -->
	</scroller>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	</scroll-view>
	<!-- #endif -->
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom');
	// #endif
	
	export default {
		props: {
			animation: {
				type: Boolean,
				default: true,
			},
			vertical: {
				type: Boolean,
				default: false,
			},
			showScrollbar: {
				type: Boolean,
				default: false,
			}
		},
		provide() {
			return {
				$tabTitle: this,
			}
		},
		data() {
			return {
				scrollTop: 0,
				scrollLeft: 0,
				old: {
					scrollTop: 0,
					scrollLeft: 0,
				}
			}
		},
		computed: {
			// #ifndef MP-WEIXIN
			itemTotalWidth() {
				let sum = 0;
				
				this.itemSizes.forEach(item => {
					sum += item.width;
				});
				
				return sum;
			},
			
			itemTotalHeight() {
				let sum = 0;
				
				this.itemSizes.forEach(item => {
					sum += item.height;
				});
				
				return sum;
			}
			// #endif
		},
		created() {
			this.width = 0;
			this.height = 0;
			
			this.itemIndex = 0;
			this.itemSizes = [];
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.getNodesSize('xg-tab-title', this).then(data => {
						this.width = data[0].width;
						this.height = data[0].height;
					});
				}, 300);
			});
		},
		methods: {
			scrollToScrollLeft(scrollLeft) {
				
				// #ifdef APP-NVUE
				dom. scrollToElement(this.$refs['tab-title-content'], {offset: scrollLeft, animated: this.animation});
				// #endif
				
				// #ifndef APP-NVUE
				this.scrollLeft = this.old.scrollLeft;
				
				this.$nextTick(function(){
					this.scrollLeft = scrollLeft;
				})
				// #endif
			},
			scrollToScrollTop(scrollTop) {
				// #ifdef APP-NVUE
				dom. scrollToElement(this.$refs['tab-title-content'], {offset: scrollTop, animated: this.animation});
				// #endif
				
				// #ifndef APP-NVUE
				this.scrollTop = this.old.scrollTop;
				
				this.$nextTick(function(){
					this.scrollTop = scrollTop;
				})
				// #endif
			},
			// #ifndef APP-NVUE
			scroll(e) {
				const scrollTop = e.detail.scrollTop;
				const scrollLeft = e.detail.scrollLeft;
				
				this.old.scrollTop = scrollTop;
				this.old.scrollLeft = scrollLeft;
			},
			// #endif
			
			// #ifdef MP-WEIXIN
			itemTotalWidth() {
				let sum = 0;
				
				this.itemSizes.forEach(item => {
					sum += item.width;
				});
				
				return sum;
			},
			
			itemTotalHeight() {
				let sum = 0;
				
				this.itemSizes.forEach(item => {
					sum += item.height;
				});
				
				return sum;
			},
			// #endif
			
			async getNodesSize(nodeIndex, ctx) {
				const nodeIndexList = Array.isArray(nodeIndex) ? nodeIndex : [nodeIndex];
				
				
				
				// #ifndef APP-NVUE
				const query = uni.createSelectorQuery().in(ctx);
				
				nodeIndexList.forEach(nodeIndex => {
					query.select('#' + nodeIndex).fields({rect: true, size: true});
				})
				
				return new Promise((resolve, reject) => {
					query.exec(data => {
						const nodeSizeData = data.map(item => {
							return item;
						})
						
						resolve(nodeSizeData);
					})
				})
				// #endif
				
				
				// #ifdef APP-NVUE
				const dom = uni.requireNativePlugin('dom');
				
				function getComponentRect(ref) {
					return new Promise(function (resolve, reject) {
						dom.getComponentRect(ref, data => {
							resolve(data.size);
						})
					})
				}
				
				
				const nodeSizeData = nodeIndexList.map(nodeIndex => {
					return getComponentRect(ctx.$refs[nodeIndex]);
				})
				
				return Promise.all(nodeSizeData);
				// #endif
			}
		},
	}
</script>

<style lang="scss" scoped>
	/* #ifdef MP-WEIXIN */
	.scroll-container {
		width: 100%;
		height: 100%;
	}
	/* #endif */
	
	.horizon-layout {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
</style>