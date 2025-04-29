"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function EnvSetupGuide() {
  const [missingVars, setMissingVars] = useState<string[]>([])
  const [configuredVars, setConfiguredVars] = useState<string[]>([])

  useEffect(() => {
    // Check which environment variables are missing or configured
    const missing: string[] = []
    const configured: string[] = []

    if (process.env.NEXT_PUBLIC_LIVEKIT_URL) {
      configured.push("NEXT_PUBLIC_LIVEKIT_URL")
    } else {
      missing.push("NEXT_PUBLIC_LIVEKIT_URL")
    }

    setMissingVars(missing)
    setConfiguredVars(configured)
  }, [])

  if (missingVars.length === 0) {
    return (
      <Card className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <CardTitle>Environment Setup Complete</CardTitle>
          </div>
          <CardDescription>All required environment variables are configured correctly.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Environment Setup Required</CardTitle>
        <CardDescription>
          Some environment variables are missing and need to be configured for full functionality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing Environment Variables</AlertTitle>
          <AlertDescription>
            <p className="mb-2">The following environment variables need to be set:</p>
            <ul className="list-disc pl-5 space-y-1">
              {missingVars.map((variable) => (
                <li key={variable}>{variable}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        {configuredVars.length > 0 && (
          <Alert
            variant="default"
            className="mt-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          >
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Configured Environment Variables</AlertTitle>
            <AlertDescription>
              <p className="mb-2">The following environment variables are correctly configured:</p>
              <ul className="list-disc pl-5 space-y-1">
                {configuredVars.map((variable) => (
                  <li key={variable}>{variable}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <h3 className="font-medium mb-2">How to set up environment variables:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Create a <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">.env.local</code> file in the
              root of your project
            </li>
            <li>
              Add the following lines to the file:
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                {`NEXT_PUBLIC_LIVEKIT_URL=wss://finance-agent-r6hpnynu.livekit.cloud`}
              </pre>
            </li>
            <li>Restart your development server</li>
          </ol>
        </div>

        <div className="mt-4">
          <p className="text-sm">
            Note: The application will work without LiveKit, but voice features will be disabled.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
