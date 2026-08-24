import React from "react";
import { useI18nStore } from "../../i18n/i18n-store";

const aivieLogo =
	"https://cdn.aivie.ch/media/wp/2021/06/19131704/logo-aivie-fast-kein-rand-400w.png";

interface CreditsProps {
	showUpstreamAttribution?: boolean;
}

export const Credits: React.FC<CreditsProps> = ({
	showUpstreamAttribution = true,
}) => {
	const i18n = useI18nStore().i18n();

	return (
		<div className="w-full flex flex-col items-end gap-2 text-right text-xs">
			<div>{i18n.info.credits.sponsoredAndOperatedBy}</div>
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://aivie.ch/?utm_source=gdq&utm_medium=gdq-app&utm_campaign=human&utm_content=credits"
			>
				<img className="h-12 w-auto" src={aivieLogo} alt="Aivie" />
			</a>
			{showUpstreamAttribution && (
				<div className="max-w-[240px] text-[10px] leading-tight text-gdk-light-gray">
					{i18n.info.credits.upstreamAttribution}
				</div>
			)}
		</div>
	);
};
