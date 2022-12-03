/**
 * 加载 svg
 */
export function loadSvg() {
    const requireAll = (requireContext) => requireContext.keys().map(requireContext);
    const req = require.context("@/icons/svg/", false, /\.svg$/);
    requireAll(req);
}

// svg 图标列表
export const iconList = () => {
    const req = require.context("@/icons/svg/", false, /\.svg$/);

    return req
        .keys()
        .map(req)
        .map((e) => e.default.id)
        .filter((e) => e.includes("icon"))
        .sort();
}