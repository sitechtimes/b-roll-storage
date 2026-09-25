<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8 bg-base-200/40">
    <div class="card bg-base-100 w-full max-w-md shadow-sm">
      <div class="card-body p-8 md:p-10 text-center">
        <h1 class="text-3xl font-bold text-base-content">Check your email</h1>
        <p class="text-sm text-base-content/70 mt-2">
          We sent you a verification link. Open it to verify your account,
          then return here to sign in.
        </p>
        <NuxtLink to="/login" class="btn btn-primary w-full mt-6">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>