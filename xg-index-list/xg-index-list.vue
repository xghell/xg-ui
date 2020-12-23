<template>
	<scroll-view id="index-list" class="index-list" :scroll-y="true" :scroll-top="scrollTop" @scroll="onScroll">
		<slot name="header"></slot>
		<slot></slot>
	</scroll-view>
</template>

<script>
	/**
	 * @event {Function()} change 
	 */
	export default {
		provide() {
			return {
				'_indexList': this
			}
		},
		props: {
			current: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				scrollTop: 0,
				
				rect: {},
				
				childrenRects: [],
			}
		},
		created() {
			this.$watch('current', () => {
				this.scrollTop = this.childrenRects[this.current].top - this.rect.top + 1;
			})
		},
		mounted() {
			this.$nextTick(function(){
				const query = uni.createSelectorQuery().in(this);
				
				query.select('#index-list').fields({rect: true});
				query.exec(data => {
					
					this.rect = data[0];
				})
			})
		},
		methods: {
			change(index) {
				this.$emit('change', {
					detail: {
						current: index,
					}
				});
			},
			
			onScroll(e) {
				const scrollTop = e.detail.scrollTop;
				// console.log(scrollTop);
				
				this.childrenRects.forEach((childrenRect, childrenRectIndex) => {
					if (childrenRect.top - this.rect.top < scrollTop && childrenRect.bottom - this.rect.top > scrollTop) {
						// console.log(childrenRect.top - this.rect.top, childrenRect.bottom - this.rect.top);
						this.change(childrenRectIndex);
						
						return;
					}
					
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.index-list {
		/* #ifdef MP-WEIXIN */
		height: 100%;
		/* #endif */
	}
</style>