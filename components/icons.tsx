
import React from 'react';
import { iconPaths } from '../data/iconPaths';

// --- Ícones Especiais ---

export const LogoIcon: React.FC<{ logo: string; className?: string }> = ({ logo, className = "w-8 h-8" }) => {
  if (logo.startsWith('<svg')) {
    const accessibleLogo = logo.includes('<title>') 
      ? logo 
      : logo.replace(/<svg(.*?)>/, `<svg$1><title>Arsenal Tools Logo</title>`);
    return <div className={className} dangerouslySetInnerHTML={{ __html: accessibleLogo }} />;
  }
  return <img src={logo} alt="Arsenal Tools Logo" className={`${className} object-contain`} />;
};

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8H6.306C9.656 39.663 16.318 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.846 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export const WhatsappGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="100%" height="100%" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet" fill="currentColor" className={className}>
<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
stroke="none">
<path d="M2290 4945 c-1101 -136 -1967 -1020 -2081 -2124 -17 -163 -7 -473 21
-630 43 -247 115 -465 227 -688 l56 -112 -167 -611 c-92 -337 -166 -613 -164
-614 2 -2 282 71 623 161 496 131 625 162 645 154 14 -5 79 -34 145 -64 214
-97 439 -161 676 -193 165 -22 454 -22 614 0 526 74 995 306 1365 676 194 193
323 370 445 611 110 217 188 454 232 704 25 146 25 577 0 730 -43 259 -110
466 -223 695 -323 651 -919 1115 -1632 1270 -222 48 -553 63 -782 35z m625
-414 c287 -53 525 -149 760 -306 402 -269 697 -686 814 -1148 86 -340 79 -726
-18 -1053 -158 -528 -533 -973 -1025 -1213 -286 -140 -550 -201 -871 -201
-368 0 -693 89 -1026 281 l-56 32 -368 -97 c-202 -53 -370 -95 -371 -93 -2 2
39 160 92 352 52 192 96 356 96 364 1 9 -25 59 -57 111 -472 768 -348 1780
295 2420 320 318 726 514 1180 570 123 15 429 4 555 -19z"/>
<path d="M1641 3658 c-57 -28 -163 -153 -207 -245 -87 -180 -85 -408 5 -618
110 -259 399 -627 684 -871 200 -171 367 -272 612 -368 251 -98 299 -109 465
-109 131 0 152 2 212 25 100 38 175 85 249 158 58 57 70 75 89 135 23 76 37
197 26 239 -5 22 -34 40 -176 111 -260 130 -365 175 -409 175 -37 0 -43 -4
-87 -62 -101 -133 -194 -236 -218 -242 -29 -7 -86 14 -217 80 -213 106 -386
249 -535 440 -81 104 -154 222 -154 250 0 11 38 70 84 130 90 117 116 161 116
194 0 11 -20 66 -43 123 -24 56 -72 172 -107 257 -44 106 -74 165 -96 188
l-32 32 -108 0 c-91 0 -116 -4 -153 -22z"/>
</g>
</svg>
);

export const BehanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.129 1.008.129 1.51h-8.361c.104 2.305 2.08 3.013 3.665 3.013 2.052 0 3.129-1.294 3.428-2.007l.963.653zm-4.37-4.015c-.012-1.637-1.127-2.738-2.618-2.738-1.558 0-2.671 1.139-2.783 2.738h5.401zM7.176 13.565v-6.565h-2.176v13h2.176v-5.69c0-1.897 1.875-1.921 2.502-1.921v-2.316c-.732 0-1.66.027-2.502.825v-3.333z"/>
  </svg>
);

export const BehanceBannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 632 544" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <path d="M 62.5 158 L 201.5 158 Q 203 160.5 208.5 159 L 229.5 165 L 241.5 171 L 262 187.5 L 275 206.5 L 280 219.5 L 283 236.5 L 283 251.5 Q 280.3 253.3 282 259.5 L 277 276.5 L 269 290.5 L 290 309.5 Q 301.5 322.5 307 341.5 L 310 355.5 L 310 381.5 Q 303.1 421.6 277.5 443 Q 267.7 452.2 254.5 458 Q 240.5 464 223.5 467 Q 217.3 465.2 215.5 468 L 129.5 468 L 128.5 469 L 112.5 469 Q 110.8 466.3 104.5 468 Q 102.8 470.7 96.5 469 L 95.5 468 L 60.5 468 L 54 462.5 Q 55.5 457 53 455.5 L 53 316.5 L 54 315.5 L 54 164.5 L 57.5 160 L 62.5 158 Z M 111 214 L 110 217 L 110 271 L 113 272 L 199 272 L 211 269 L 216 266 L 222 259 L 226 246 L 224 234 L 218 223 L 207 216 L 199 214 L 111 214 Z M 111 330 L 111 412 L 215 412 L 228 409 L 239 403 Q 251 395 254 378 L 254 363 Q 252 353 247 347 Q 238 334 221 330 L 111 330 Z M 387.5 170 L 494.5 170 L 498.5 171 L 502 174.5 L 503 177.5 L 503 206.5 L 499.5 212 L 497.5 213 L 385.5 213 L 382 210.5 L 381 208.5 L 381 175.5 L 384.5 171 L 387.5 170 Z M 438.5 228 L 452.5 228 L 459.5 230 L 465.5 230 L 488.5 237 Q 516.1 248.4 534 269.5 Q 547 284 555 303.5 L 562 326.5 L 564 355.5 L 560.5 363 L 558.5 364 L 388.5 364 L 387 365.5 Q 392.6 388.4 408.5 401 Q 418.4 409.6 432.5 414 L 437.5 415 L 458.5 415 L 476.5 408 L 486.5 400 L 491.5 398 L 550.5 398 Q 553 399 552 403.5 L 544 418.5 L 526.5 439 Q 508.4 456.4 482.5 466 L 462.5 471 L 436.5 472 L 412.5 467 L 389.5 457 Q 372.6 447.4 360 433.5 Q 345 417.5 336 395.5 L 329 370.5 Q 330.8 364.3 328 362.5 L 328 338.5 L 329 337.5 L 331 320.5 L 338 300.5 Q 348.8 275.8 367.5 259 Q 381.5 246 400.5 238 L 417.5 232 L 438.5 228 Z M 438 285 Q 420 288 409 298 L 395 314 L 397 316 L 496 316 L 497 315 L 494 310 Q 484 296 468 289 L 455 285 L 438 285 Z" />
  </svg>
);

export const BlogBannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 808 872" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <path d="M 242.5 129 L 435.5 129 L 436.5 130 L 457.5 132 Q 513.9 145.1 547 181.5 Q 569.3 204.7 582 237.5 L 591 271.5 L 592 287.5 L 593 288.5 L 593 316.5 L 592 317.5 L 592 328.5 L 591 329.5 L 590 341.5 L 581 372.5 Q 570.7 398.5 555 418 L 570.5 420 L 589.5 425 L 616.5 436 Q 646.3 451.7 667 476.5 Q 689 502 700 538.5 L 705 563.5 L 705 575.5 L 706 576.5 L 706 610.5 L 705 611.5 L 704 627.5 L 700 645.5 Q 694.4 663.9 686 679.5 Q 670.8 707.3 647.5 727 Q 626.9 744.9 599.5 756 L 576.5 763 L 561.5 766 L 552.5 766 L 551.5 767 L 243.5 767 L 242.5 766 L 234.5 766 L 213.5 762 L 181.5 750 Q 151.9 735.1 131 711.5 Q 115.5 694.5 105 672.5 L 96 649.5 L 90 621.5 L 90 611.5 L 89 610.5 L 89 286.5 L 90 285.5 L 91 268.5 L 96 247.5 L 105 223.5 Q 119.8 193.3 143.5 172 Q 161.6 155.1 185.5 144 L 213.5 134 L 242.5 129 Z M 290 191 L 289 192 L 239 192 Q 237 194 233 193 Q 207 199 190 214 Q 174 227 164 245 L 154 270 L 152 279 L 152 289 L 151 290 L 151 416 L 153 417 L 433 417 L 434 416 L 448 415 L 465 410 Q 482 403 495 392 Q 509 380 518 363 L 526 343 L 530 322 L 530 288 L 526 267 Q 519 244 505 228 Q 483 200 442 192 L 400 192 L 399 191 L 290 191 Z M 152 479 L 151 482 L 151 610 L 152 611 L 152 620 Q 159 652 178 672 Q 192 688 214 697 L 233 703 Q 237 702 239 704 L 256 704 L 257 705 L 552 704 L 568 701 L 584 695 Q 596 689 607 680 Q 620 668 630 652 L 639 631 L 643 610 L 643 575 L 642 574 L 642 567 L 640 557 L 633 539 L 617 515 Q 605 500 588 491 L 565 482 L 548 479 L 152 479 Z" />
  </svg>
);

export const ThreePSDGratis1Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 511 320" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <path opacity=".988" d="M191 0L459.5 0L469.5 2L481.5 7L497 19.5L507 35.5L511 51.5L511 320L242.5 320L232.5 318L220.5 313L205 300.5L200.5 294L181.5 301L159.5 306L142.5 307L141.5 308L107.5 308L106.5 307L97.5 307L80.5 304L55.5 296Q33.1 286.4 18 269.5Q7.8 258.2 3 241.5L1 232.5L1 217L55.5 217L56 219.5Q58.8 236.8 70.5 245Q81.5 253.5 97.5 257L108.5 258L109.5 259L139.5 259L140.5 258L151.5 257L164.5 253Q176.8 248.3 184 238.5L190 223.5L190 208.5Q186.7 196.3 177.5 190L161.5 183L140.5 179L130.5 179L129.5 178L77 178L77 134L131.5 134L132.5 133L150.5 132L165.5 128Q175.5 124.5 181 116.5Q187.1 108.1 185 91.5Q181.5 78 171.5 71L162.5 66L147.5 62Q142 63.5 140.5 61L108.5 61L107.5 62L96.5 63L84.5 67L69 77L62 87.5L59 101L4.5 101L4 100.5L4 85.5Q6.4 70.9 13 60.5Q21 48 32.5 39Q53 23 82.5 16L98.5 13L106.5 13L107.5 12L142.5 12L143.5 13L153.5 13L154.5 14L166.5 15L191 22L191 0ZM207 14L205 16L205 28L222 39Q232 48 239 61L245 80L245 101L244 106Q241 117 235 125Q225 138 207 144L205 146L205 163Q220 167 231 176Q239 183 245 194L249 205L251 216L251 232L249 243Q245 257 236 268Q227 279 215 286Q212 285 213 288Q219 296 229 301L236 304L247 306L496 306L497 305L497 57L496 56L495 45L489 33Q483 24 474 19L467 16L456 14L207 14ZM190 149L184 151L163 153L158 155L183 157L191 159L191 150L190 149Z" />
    <path opacity=".988" d="M259 105L303.5 105L308.5 106Q322.3 109.3 329 119.5L335 133.5L335 146.5Q332.1 161.1 321.5 168L311.5 173L299.5 176L279 176L279 214L259 214L259 105ZM281 120L279 122L279 160L281 161L296 161L309 156L313 151L315 144L314 133L312 129Q304 117 281 120Z" />
    <path opacity=".988" d="M363.5 133L381.5 133L392 136Q394.2 141.2 393 151.5L390.5 153Q383.1 146.4 368.5 147L362 150.5L361 156.5L364.5 161L386.5 171L394 178.5Q399 184 397 196.5Q394.5 205.5 387.5 210L375.5 215L355.5 215L345.5 212L341 208.5L341 193.5L343.5 193Q352 201.5 370.5 200L377 195.5Q378.1 187.9 373.5 186L355.5 178L346 170.5Q340.2 164.8 342 151.5Q344.3 143.8 349.5 139L363.5 133Z" />
    <path opacity=".988" d="M408 135L445.5 135L450.5 136Q462.7 139.3 470 147.5Q476.5 154.5 479 165.5L479 182.5Q475.8 196.3 466.5 204Q458.4 210.9 445.5 213L408 213L408 135ZM427 149L427 199L444 199L453 195L459 186L461 178Q462 164 456 157Q452 151 444 149L427 149Z" />
  </svg>
);


// --- Componente de Ícone Genérico ---

export type IconName = keyof typeof iconPaths;

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  const iconData = iconPaths[name as IconName];

  if (!iconData) {
    // Fail silently in production or render placeholder
    return <div className={`${className || 'w-6 h-6'} bg-red-500/20 rounded`} />;
  }

  const { viewBox = '0 0 24 24', content, ...dataProps } = iconData;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      {...dataProps}
      {...rest}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

// Exports adicionais de ícones usados como componentes
export const CloseIcon = ({ className }: { className?: string }) => <Icon name="x" className={className} />;
export const CloseIconSmall = ({ className = 'w-4 h-4' }: { className?: string }) => <Icon name="x" className={className} />;
export const EnterFullscreenIcon = ({ className }: { className?: string }) => <Icon name="maximize" className={className} />;
export const ExitFullscreenIcon = ({ className }: { className?: string }) => <Icon name="minimize" className={className} />;
export const CoffeeIcon = ({ className }: { className?: string }) => <Icon name="coffee" className={className} />;
export const ArrowLeftIcon = ({ className }: { className?: string }) => <Icon name="arrow-left" className={className} />;
export const ArrowRightIcon = ({ className }: { className?: string }) => <Icon name="chevron-right" className={className} />;
export const InstagramIcon = ({ className }: { className?: string }) => <Icon name="instagram" className={className} />;
export const GlobeIcon = ({ className }: { className?: string }) => <Icon name="globe" className={className} />;
export const EditIcon = ({ className }: { className?: string }) => <Icon name="pencil" className={className} />;
export const ChevronDownIcon = ({ className }: { className?: string }) => <Icon name="chevron-down" className={className} />;
export const HamburgerIcon = ({ className }: { className?: string }) => <Icon name="menu" className={className} />;
export const SunIcon = ({ className }: { className?: string }) => <Icon name="sun" className={className} />;
export const MoonIcon = ({ className }: { className?: string }) => <Icon name="moon" className={className} />;
export const SuccessIcon = ({ className }: { className?: string }) => <Icon name="check-circle" className={className} />;
export const StarIcon = ({ className }: { className?: string }) => <Icon name="star" className={className} />;
export const StarFilledIcon = ({ className }: { className?: string }) => <Icon name="star-filled" className={className} />;