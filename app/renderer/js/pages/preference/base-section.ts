import type {Html} from "../../../../common/html.js";
import {html} from "../../../../common/html.js";
import {generateNodeFromHtml} from "../../components/base.js";
import {ipcRenderer} from "../../typed-ipc-renderer.js";

type BaseSectionProps = {
  $element: HTMLElement;
  disabled?: boolean;
  value: boolean;
  clickHandler: () => void;
};

export function generateSettingOption(props: BaseSectionProps): void {
  const {$element, disabled, value, clickHandler} = props;

  $element.textContent = "";

  const $optionControl = generateNodeFromHtml(
    generateOptionHtml(value, disabled),
  );
  $element.append($optionControl);

  if (!disabled) {
    $optionControl.addEventListener("click", clickHandler);
  }
}

export function generateOptionHtml(
  settingOption: boolean,
  disabled?: boolean,
): Html {
  const labelHtml = disabled
    ? // eslint-disable-next-line unicorn/template-indent
      html`<label
        class="disallowed"
        title="Setting locked by system administrator."
      ></label>`
    : html`<label></label>`;
  if (settingOption) {
    return html`
      <div class="action">
        <div class="switch">
          <input class="toggle toggle-round" type="checkbox" checked disabled />
          ${labelHtml}
        </div>
      </div>
    `;
  }

  return html`
    <div class="action">
      <div class="switch">
        <input class="toggle toggle-round" type="checkbox" />
        ${labelHtml}
      </div>
    </div>
  `;
}

/* A method that in future can be used to create dropdown menus using <select> <option> tags.
     it needs an object which has ``key: value`` pairs and will return a string that can be appended to HTML
  */
export function generateSelectHtml(
  options: Record<string, string>,
  className?: string,
  idName?: string,
): Html {
  const optionsHtml = html``.join(
    Object.keys(options).map(
      (key) => html`
        <option name="${key}" value="${key}">${options[key]}</option>
      `,
    ),
  );
  return html`
    <select class="${className}" id="${idName}">
      ${optionsHtml}
    </select>
  `;
}

export function reloadApp(): void {
  ipcRenderer.send("forward-message", "reload-viewer");
}
export function exitSettings(): void {
  const exitButton = document.querySelector(".exit-sign")!;
  exitButton.addEventListener("click", async () => {
    ipcRenderer.send("forward-message", "exit-settings");
  });
}