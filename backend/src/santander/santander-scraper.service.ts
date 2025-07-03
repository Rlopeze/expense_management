import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';

export interface SantanderCredentials {
  username: string;
  password: string;
}

export interface ScrapingResult {
  success: boolean;
  token?: string;
  error?: string;
  cookies?: any[];
}

@Injectable()
export class SantanderScraperService {
  private readonly logger = new Logger(SantanderScraperService.name);
  private browser: Browser | null = null;

  async extractToken(
    credentials: SantanderCredentials,
  ): Promise<ScrapingResult> {
    try {
      await this.launchBrowser();
      const page = await this.openLoginPage();

      await this.revealLoginForm(page);
      await this.checkForServiceError(page);
      await this.fillCredentials(page, credentials);
      await this.submitLogin(page);
      await this.waitAfterLogin(page);

      const cookies = await page.cookies();
      const bschToken = cookies.find((cookie) => cookie.name === 'bsch_t');

      if (!bschToken) {
        this.logger.warn('bsch_t token not found');
        return {
          success: false,
          error: 'bsch_t token not found',
          cookies: cookies.map((c) => ({ name: c.name, value: c.value })),
        };
      }

      this.logger.log('Successfully extracted bsch_t token');
      return {
        success: true,
        token: bschToken.value,
        cookies: cookies.map((c) => ({ name: c.name, value: c.value })),
      };
    } catch (error) {
      this.logger.error('Error during token extraction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      await this.closeBrowser();
    }
  }

  private async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
      ],
    });
  }

  private async openLoginPage(): Promise<Page> {
    const page = await this.browser!.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );

    await page.goto('https://www.santander.cl/personas', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    return page;
  }

  private async revealLoginForm(page: Page): Promise<void> {
    await page.waitForSelector('.btn-ingresar', {
      timeout: 10000,
    });
    await page.click('.btn-ingresar');
  }

  private async checkForServiceError(page: Page): Promise<void> {
    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes('acceso está temporalmente fuera de servicio')) {
      throw new Error('Login deshabilitado por el banco');
    }
  }

  private async fillCredentials(
    page: Page,
    credentials: SantanderCredentials,
  ): Promise<void> {
    const usernameInput = await page.$('input[id="rut"]');
    const passwordInput = await page.$('input[id="pass"]');
    if (!usernameInput || !passwordInput) {
      throw new Error('No se encontraron los campos de login');
    }

    await usernameInput.type(credentials.username);
    await passwordInput.type(credentials.password);
  }

  private async submitLogin(page: Page): Promise<void> {
    const button = await this.findLoginButton(page);
    if (!button) throw new Error('No se encontró el botón de login');

    await button.click();
  }

  private async waitAfterLogin(page: Page): Promise<void> {
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  private async findLoginButton(
    page: Page,
  ): Promise<ElementHandle<Element> | null> {
    const buttons = await page.$$('button, input[type="submit"]');
    for (const button of buttons) {
      const text = await page.evaluate(
        (el) => el.textContent?.toLowerCase() || '',
        button,
      );
      if (
        text.includes('ingresar') ||
        text.includes('login') ||
        text.includes('entrar')
      ) {
        return button;
      }
    }
    return null;
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
