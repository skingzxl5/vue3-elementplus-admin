
<template>
    <div class="scroll" ref="container" @wheel.prevent="handleScroll">
		<div class="scroll-wrapper" ref="wrapper" :style="{ left: left + 'px' }">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { ref,onMounted } from 'vue';

const padding = 15;
export default {
    setup () {
        const left = ref(0);
        const container = ref(null);
        const wrapper = ref(null);

        onMounted(()=>{
            // console.log(container.value);
        })

        const handleScroll = (e) => {
			const eventDelta = e.wheelDelta || -e.deltaY * 3;
			const containerWidth = container.value.offsetWidth;
			const wrapperWidth = wrapper.value.offsetWidth;

			if (eventDelta > 0) {
				left.value = Math.min(0, left.value + eventDelta);
			} else {
				if (containerWidth - padding < wrapperWidth) {
					if (left.value  < -(wrapperWidth - containerWidth + padding)) {
						// eslint-disable-next-line no-self-assign
						left.value  = left.value;
					} else {
						left.value = Math.max(
							left.value  + eventDelta,
							containerWidth - wrapperWidth - padding
						);
					}
				} else {
					left.value  = 0;
				}
			}
		}

        const moveToTarget = (target) => {
			const containerWidth = container.value.offsetWidth;
			const targetLeft = target.offsetLeft;
			const targetWidth = target.offsetWidth;

			if (targetLeft < -left.value) {
				// tag in the left
				left.value = -targetLeft + padding;
			} else if (
				targetLeft + padding > -left.value &&
				targetLeft + targetWidth < -left.value + containerWidth - padding
			) {
                // console.log(1);
			} else {
				// tag in the right
				left.value = -(targetLeft - (containerWidth - targetWidth) + padding);
			}
		}

        return {
            left,
            container,
            wrapper,
            handleScroll,
            moveToTarget
        }
    }
}
</script>

<style lang="scss" scoped>
.scroll {
	white-space: nowrap;
	position: relative;
	overflow: hidden;
	width: 100%;

	.scroll-wrapper {
		position: absolute;
	}
}
</style>