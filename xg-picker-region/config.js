export default {
	data() {
		return {
			old: {
				currentContentIndex: 0,
			},
			
			currentAddressItemIndex: 'province',
			
			currentContentIndex: 0,
			currentTitleIndex: 0,
		}
	},
	methods: {
		setCurrentAddressItemIndex(index) {
			this.currentAddressItemIndex = index;
		},
		setOldCurrentContentIndex(index) {
			this.old.currentContentIndex = index;
		},
		setCurrentContentIndex(index) {
			this.currentContentIndex = this.old.currentContentIndex;
			
			this.$nextTick(() => {
				this.currentContentIndex = index;
			})
		},
		setCurrentTitleIndex(index) {
			this.currentTitleIndex = index;
		}
	}
}