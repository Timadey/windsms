import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-32 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <img
                    src="/windsms-logo.png"
                    alt="Windsms logo"
                    className="fill-current text-white dark:text-black"
                />
                {/*<AppLogoIcon className="size-5 fill-current text-white dark:text-black" />*/}
            </div>
            {/*<div className="ml-1 grid flex-1 text-left text-sm">*/}
            {/*    <span className="mb-0.5 truncate leading-tight font-semibold">*/}
            {/*        WindSMS*/}
            {/*    </span>*/}
            {/*</div>*/}
        </>
    );
}
