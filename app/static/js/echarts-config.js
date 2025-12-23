/**
 * Apache ECharts Configuration
 * Modern Office Theme - Clean White & Professional
 */

// Modern Office Color Palette
const OFFICE_COLORS = {
    primary: '#2563eb',      // Professional Blue
    secondary: '#7c3aed',    // Modern Purple
    success: '#10b981',      // Fresh Green
    warning: '#f59e0b',      // Warm Orange
    danger: '#ef4444',       // Alert Red
    info: '#06b6d4',         // Clear Cyan
    neutral: '#64748b',      // Soft Gray
    
    gradient: {
        blue: ['#3b82f6', '#2563eb'],
        purple: ['#8b5cf6', '#7c3aed'],
        green: ['#34d399', '#10b981'],
        orange: ['#fb923c', '#f59e0b'],
        cyan: ['#22d3ee', '#06b6d4']
    },
    
    background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        card: '#ffffff',
        hover: '#f1f5f9'
    },
    
    text: {
        primary: '#1e293b',
        secondary: '#64748b',
        muted: '#94a3b8'
    },
    
    border: {
        light: '#e2e8f0',
        default: '#cbd5e1',
        dark: '#94a3b8'
    }
};

// Modern Office Theme for ECharts
const MODERN_OFFICE_THEME = {
    color: [
        OFFICE_COLORS.primary,
        OFFICE_COLORS.success,
        OFFICE_COLORS.warning,
        OFFICE_COLORS.secondary,
        OFFICE_COLORS.danger,
        OFFICE_COLORS.info,
        OFFICE_COLORS.neutral
    ],
    
    backgroundColor: OFFICE_COLORS.background.primary,
    
    textStyle: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 13,
        color: OFFICE_COLORS.text.primary
    },
    
    title: {
        textStyle: {
            color: OFFICE_COLORS.text.primary,
            fontWeight: 600,
            fontSize: 16
        },
        subtextStyle: {
            color: OFFICE_COLORS.text.secondary,
            fontSize: 12
        }
    },
    
    line: {
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
            width: 2.5
        },
        itemStyle: {
            borderWidth: 2,
            borderColor: '#fff'
        },
        emphasis: {
            scale: true,
            scaleSize: 8
        }
    },
    
    bar: {
        barMaxWidth: 40,
        itemStyle: {
            borderRadius: [6, 6, 0, 0],
            borderWidth: 0
        }
    },
    
    pie: {
        radius: ['40%', '65%'],
        itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 3
        },
        label: {
            color: OFFICE_COLORS.text.primary,
            fontSize: 12,
            fontWeight: 500
        },
        labelLine: {
            lineStyle: {
                color: OFFICE_COLORS.border.default
            }
        }
    },
    
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
        borderWidth: 0
    },
    
    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: OFFICE_COLORS.border.light
            }
        },
        axisTick: {
            lineStyle: {
                color: OFFICE_COLORS.border.light
            }
        },
        axisLabel: {
            color: OFFICE_COLORS.text.secondary,
            fontSize: 11
        },
        splitLine: {
            show: false
        }
    },
    
    valueAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: OFFICE_COLORS.text.secondary,
            fontSize: 11
        },
        splitLine: {
            lineStyle: {
                color: OFFICE_COLORS.border.light,
                type: 'dashed'
            }
        }
    },
    
    tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: OFFICE_COLORS.border.default,
        borderWidth: 1,
        textStyle: {
            color: OFFICE_COLORS.text.primary,
            fontSize: 12
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border-radius: 8px; padding: 12px;'
    },
    
    legend: {
        textStyle: {
            color: OFFICE_COLORS.text.secondary,
            fontSize: 12
        },
        icon: 'circle',
        itemWidth: 12,
        itemHeight: 12
    }
};

// Helper Functions
const EChartsHelper = {
    /**
     * Create gradient color
     */
    createGradient: function(colors, direction = 'vertical') {
        return {
            type: 'linear',
            x: 0,
            y: direction === 'vertical' ? 0 : 1,
            x2: direction === 'vertical' ? 0 : 1,
            y2: direction === 'vertical' ? 1 : 0,
            colorStops: colors.map((color, index) => ({
                offset: index / (colors.length - 1),
                color: color
            }))
        };
    },
    
    /**
     * Format large numbers
     */
    formatNumber: function(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    /**
     * Format bytes
     */
    formatBytes: function(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    /**
     * Default tooltip formatter
     */
    tooltipFormatter: function(params) {
        if (Array.isArray(params)) {
            let result = `<div style="font-weight: 600; margin-bottom: 6px;">${params[0].axisValue}</div>`;
            params.forEach(param => {
                result += `
                    <div style="display: flex; align-items: center; margin: 4px 0;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                        <span style="flex: 1;">${param.seriesName}:</span>
                        <span style="font-weight: 600; margin-left: 12px;">${param.value}</span>
                    </div>
                `;
            });
            return result;
        } else {
            return `
                <div style="font-weight: 600; margin-bottom: 6px;">${params.name}</div>
                <div style="display: flex; align-items: center;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%; margin-right: 8px;"></span>
                    <span style="flex: 1;">${params.seriesName}:</span>
                    <span style="font-weight: 600; margin-left: 12px;">${params.value}</span>
                </div>
            `;
        }
    }
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OFFICE_COLORS, MODERN_OFFICE_THEME, EChartsHelper };
}
