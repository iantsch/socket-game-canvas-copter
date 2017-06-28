
export default class ColorManager {

    constructor() {
        this.config = {
            threshold: 100,
            colorSaturation: 0.99,
            colorValue: 0.99
        };
        this.hue = Math.random();
    }

    getColor() {
        this.hue += 0.618033988749895;
        this.hue %= 1;

        return ColorManager.convertHSVToRGB(Math.floor(this.hue * 360), this.config.colorSaturation, this.config.colorValue);
    }

    reset() {
        this.hue = Math.random();
    }

    static convertRGBToHex(color) {
        let r,
            g,
            b;

        r = color[0].toString(16);
        g = color[1].toString(16);
        b = color[2].toString(16);

        if (r.length < 2) {
            r = '0' + r;
        }

        if (g.length < 2) {
            g = '0' + g;
        }

        if (b.length < 2) {
            b = '0' + b;
        }

        return '#' + r + g + b;
    };

    static convertHSVToRGB(hue, saturation, value) {
        let h,
            hi,
            f,
            p,
            q,
            t,
            rgbResult = [];

        if (saturation === 0) {
            rgbResult[0] = value;
            rgbResult[1] = value;
            rgbResult[2] = value;
        }

        h = hue / 60;
        hi = Math.floor(h);
        f = h - hi;
        p = value * (1 - saturation);
        q = value * (1 - saturation * f);
        t = value * (1 - saturation * (1 - f));

        if (hi === 0) {
            rgbResult = [value, t, p];
        } else if (hi == 1) {
            rgbResult = [q, value, p];
        } else if (hi == 2) {
            rgbResult = [p, value, t];
        } else if (hi == 3) {
            rgbResult = [p, q, value];
        } else if (hi == 4) {
            rgbResult = [t, p, value];
        } else if (hi == 5) {
            rgbResult = [value, p, q];
        }

        return [
            Math.floor(rgbResult[0] * 255),
            Math.floor(rgbResult[1] * 255),
            Math.floor(rgbResult[2] * 255)
        ];
    };
};
